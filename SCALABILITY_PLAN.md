# AI Government Complaint Portal - Scalability & Performance Plan

## 1. Executive Summary & Goals

The objective of this plan is to transform the **AI Government Complaint Portal** into an enterprise-grade, high-throughput system capable of handling thousands of concurrent users and high complaint submission spikes—**without altering existing user features, APIs, or business workflows**.

---

## 2. System Architecture & High-Level Scalability Diagram

```
                              ┌────────────────────────┐
                              │  React Client (Vite)   │
                              └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │ NGINX / Cloud Balancer │
                              └───────────┬────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │ Rate Limiting & Gzip Response Compression     │
                  └───────────────────────┬───────────────────────┘
                                          │
                ┌─────────────────────────┴─────────────────────────┐
                │ Node.js Cluster / PM2 Multi-Core Web Instances    │
                └───────┬─────────────────┬─────────────────┬───────┘
                        │                 │                 │
                        ▼                 ▼                 ▼
             ┌────────────────────┐ ┌───────────┐ ┌──────────────────┐
             │ Redis Cache Layer  │ │  MongoDB  │ │ BullMQ Task Queue│
             │ (Dept, User Auth)  │ │ Cluster   │ │ (Async AI/Cloud) │
             └────────────────────┘ └───────────┘ └────────┬─────────┘
                                                           │
                                             ┌─────────────┴─────────────┐
                                             ▼                           ▼
                                   ┌──────────────────┐        ┌──────────────────┐
                                   │ Cloudinary CDN   │        │ Google Gemini AI │
                                   └──────────────────┘        └──────────────────┘
```

---

## 3. Core Bottlenecks Identified

1. **Synchronous Third-Party API Blocking**: Image uploading to Cloudinary and Gemini AI classification run directly inside the HTTP request loop during complaint creation (`createComplain`), locking server workers for several seconds.
2. **Missing Database Indexes**: Mongo collection queries lack compound indexes on frequently filtered fields (`status`, `department`, `citizen`, `assignedOfficial`, `createdAt`), causing full collection scans under load.
3. **Uncached Frequently-Read Metadata**: Department lists and user roles are repeatedly queried from MongoDB on every request instead of being served from fast Redis in-memory cache.
4. **Single-Threaded Execution**: Node.js app runs on a single worker core without process clustering or CPU core utilization.
5. **Uncompressed Payload Transfers**: Express JSON API responses and frontend assets do not use HTTP payload compression.

---

## 4. Scalability Roadmap & Technical Specifications

### Phase 1: Database & Query Optimization (MongoDB)

1. **Compound & Text Indexing**:
   - `Complain` Schema:
     - `{ status: 1, createdAt: -1 }` (Admin & Official filtering)
     - `{ department: 1, status: 1 }` (Department complaints lookup)
     - `{ assignedOfficial: 1, status: 1 }` (Official dashboard lookup)
     - `{ citizen: 1, createdAt: -1 }` (Citizen complaint history)
   - `User` Schema:
     - `{ email: 1 }` (Unique)
     - `{ role: 1, department: 1, leaveStatus: 1, assignComplainCount: 1 }` (Automated official assignment queries)

2. **Connection Pooling**:
   - Update `Config/database.js` connection parameters:
     ```javascript
     mongoose.connect(process.env.MONGO_DB_URL, {
       maxPoolSize: 50,
       minPoolSize: 10,
       socketTimeoutMS: 45000,
     });
     ```

3. **Read Performance Tuning**:
   - Apply `.lean()` to all read-only Mongoose queries across `Complain.js`, `ComplainAdmin.js`, and `ComplainOfficial.js` to bypass Mongoose document instantiation overhead.
   - Use field projections (`.select()`) to fetch only required fields for list views.
   - Enforce pagination limits (limit/offset or cursor-based) to prevent fetching massive arrays into memory.

---

### Phase 2: In-Memory Caching & Session Storage (Redis)

1. **Department & Reference Caching**:
   - Cache `Department.find({})` in Redis with a 1-hour TTL (`departments:all`).
   - Automatically invalidate cache key when a department is created or updated.

2. **Rate-Limiting Layer**:
   - Protect authentication and submission endpoints against abuse using `express-rate-limit` with Redis store (`rate-limit-redis`).

---

### Phase 3: Asynchronous Job Queuing (Decoupling Heavy Workloads)

1. **Background Job Queue (BullMQ / Redis)**:
   - Move Cloudinary image uploads and Gemini AI complaint analysis out of the synchronous request-response flow into a dedicated queue worker process.
   - Upon submission, create a complaint ticket immediately in `PENDING` status and return an instant response to the client.
   - Workers process image optimization and AI department matching asynchronously, updating complaint metadata upon completion.

---

### Phase 4: Server Concurrency & Infrastructure Scaling

1. **Node.js Process Clustering**:
   - Wrap `Backend/index.js` startup in Node's native `cluster` module or deploy via PM2 Cluster Mode (`pm2 start index.js -i max`) to leverage all CPU cores.

2. **Middleware Payload Compression**:
   - Add Gzip/Brotli compression middleware (`compression`) to Express app to reduce API JSON payload sizes by up to 70%.

3. **Graceful Shutdown**:
   - Implement SIGINT/SIGTERM process listeners to cleanly close Mongo and Redis connection pools without dropping active HTTP requests.

---

### Phase 5: Frontend Build & Bundle Optimization (React / Vite)

1. **Code Splitting & Dynamic Imports**:
   - Lazy load route components using `React.lazy()` and `Suspense` in `App.jsx`.

2. **Vendor Chunking**:
   - Configure `manualChunks` in `vite.config.js` to split vendor packages (React, Lucide icons, Chart libraries) into separate cached browser chunks:
     ```javascript
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom', 'react-router-dom'],
             ui: ['lucide-react']
           }
         }
       }
     }
     ```

3. **Asset CDN & Image Optimization**:
   - Serve frontend static build assets via Cloudflare / Cloud CDN with long-term cache control headers (`Cache-Control: max-age=31536000, immutable`).

---

## 5. Verification & Benchmark Checklist

- [ ] **Database**: Verify index usage via MongoDB `db.complains.explain("executionStats")`.
- [ ] **Response Time**: Verify p95 API response times drop below 200ms for read operations.
- [ ] **Throughput**: Execute load testing (using k6 or Autocannon) to ensure the server handles 1,000+ requests/sec without memory leaks.
- [ ] **Bundle Size**: Confirm initial frontend JS bundle size is under 200KB gzipped.
