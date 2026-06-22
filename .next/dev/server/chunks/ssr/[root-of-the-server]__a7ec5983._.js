module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/local-storage/db.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Local Storage Database
// Complete offline data management using IndexedDB and localStorage
__turbopack_context__.s([
    "LocalDB",
    ()=>LocalDB,
    "initializeDatabase",
    ()=>initializeDatabase
]);
function initializeDatabase() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    // Sample mutual funds
    const funds = undefined;
    // Generate NAV history for each fund (last 30 days)
    const navHistory = undefined;
    // Generate performance metrics
    const performance = undefined;
    const periods = undefined;
    // assign demo manager to funds (some variability)
    const managerAssignedFunds = undefined;
    // Create a simple securities dataset derived from funds
    const securities = undefined;
    // Sample users for demo mode (Investor, Portfolio Manager, Admin)
    const now = undefined;
    const users = undefined;
    // Sample investments and transactions to show activity for each role
    const investments = undefined;
    const transactions = undefined;
}
const LocalDB = {
    // Users
    async createUser (email, password, fullName, role = "investor") {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        // Check if user exists
        if (users.find((u)=>u.email === email)) {
            throw new Error("User already exists");
        }
        const newUser = {
            id: crypto.randomUUID(),
            email,
            password,
            full_name: fullName,
            role,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        return newUser;
    },
    async loginUser (email, password) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u)=>u.email === email && u.password === password);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // Store current session
        localStorage.setItem("current_user", JSON.stringify(user));
        return user;
    },
    getCurrentUser () {
        const userStr = localStorage.getItem("current_user");
        return userStr ? JSON.parse(userStr) : null;
    },
    logout () {
        localStorage.removeItem("current_user");
    },
    // Mutual Funds
    async getFunds () {
        return JSON.parse(localStorage.getItem("mutual_funds") || "[]");
    },
    async getSecurities () {
        return JSON.parse(localStorage.getItem("securities") || "[]");
    },
    async getSecurity (id) {
        const secs = JSON.parse(localStorage.getItem("securities") || "[]");
        return secs.find((s)=>s.id === id || s.symbol === id) || null;
    },
    async getFund (id) {
        const funds = await this.getFunds();
        return funds.find((f)=>f.id === id) || null;
    },
    // NAV History
    async getNAVHistory (fundId) {
        const history = JSON.parse(localStorage.getItem("nav_history") || "[]");
        return history.filter((h)=>h.fund_id === fundId).sort((a, b)=>a.date.localeCompare(b.date));
    },
    // Performance
    async getFundPerformance (fundId) {
        const performance = JSON.parse(localStorage.getItem("fund_performance") || "[]");
        return performance.filter((p)=>p.fund_id === fundId);
    },
    // Investments
    async getInvestments (userId) {
        const investments = JSON.parse(localStorage.getItem("investments") || "[]");
        return investments.filter((i)=>i.investor_id === userId);
    },
    async createInvestment (userId, fundId, amount, nav) {
        const investments = JSON.parse(localStorage.getItem("investments") || "[]");
        const units = amount / nav;
        const newInvestment = {
            id: crypto.randomUUID(),
            investor_id: userId,
            fund_id: fundId,
            units,
            average_nav: nav,
            total_invested: amount,
            current_value: amount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        investments.push(newInvestment);
        localStorage.setItem("investments", JSON.stringify(investments));
        // Create transaction
        await this.createTransaction(userId, fundId, "buy", amount, units, nav);
        return newInvestment;
    },
    // Transactions
    async getTransactions (userId) {
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
        return transactions.filter((t)=>t.investor_id === userId).sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    async createTransaction (userId, fundId, type, amount, units, nav) {
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
        const newTransaction = {
            id: crypto.randomUUID(),
            investor_id: userId,
            fund_id: fundId,
            transaction_type: type,
            amount,
            units,
            nav,
            status: "completed",
            processed_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        return newTransaction;
    },
    // Watchlist
    async getWatchlist (userId) {
        const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        return watchlist.filter((w)=>w.user_id === userId);
    },
    async addToWatchlist (userId, fundId) {
        const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        // Check if already in watchlist
        if (watchlist.find((w)=>w.user_id === userId && w.fund_id === fundId)) {
            throw new Error("Fund already in watchlist");
        }
        const newItem = {
            id: crypto.randomUUID(),
            user_id: userId,
            fund_id: fundId,
            created_at: new Date().toISOString()
        };
        watchlist.push(newItem);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        return newItem;
    },
    async removeFromWatchlist (userId, fundId) {
        const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        const updated = watchlist.filter((w)=>!(w.user_id === userId && w.fund_id === fundId));
        localStorage.setItem("watchlist", JSON.stringify(updated));
    },
    // Investor profiles
    async getInvestorProfile (userId) {
        const profiles = JSON.parse(localStorage.getItem("investor_profiles") || "[]");
        return profiles.find((p)=>p.user_id === userId) || null;
    },
    async upsertInvestorProfile (profile) {
        const profiles = JSON.parse(localStorage.getItem("investor_profiles") || "[]");
        const existingIndex = profiles.findIndex((p)=>p.user_id === profile.user_id);
        if (existingIndex >= 0) {
            const updated = {
                ...profiles[existingIndex],
                ...profile,
                updated_at: new Date().toISOString()
            };
            profiles[existingIndex] = updated;
            localStorage.setItem("investor_profiles", JSON.stringify(profiles));
            return updated;
        }
        const newProfile = {
            id: crypto.randomUUID(),
            user_id: profile.user_id,
            risk_tolerance: profile.risk_tolerance,
            investment_experience: profile.investment_experience,
            annual_income: profile.annual_income,
            investment_goals: profile.investment_goals,
            completed_risk_assessment: profile.completed_risk_assessment || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        profiles.push(newProfile);
        localStorage.setItem("investor_profiles", JSON.stringify(profiles));
        return newProfile;
    },
    // Admin operations
    async getAllUsers () {
        return JSON.parse(localStorage.getItem("users") || "[]");
    },
    async getAllInvestments () {
        return JSON.parse(localStorage.getItem("investments") || "[]");
    },
    async getAllTransactions () {
        return JSON.parse(localStorage.getItem("transactions") || "[]");
    },
    // Strategies (portfolio manager tools)
    async getStrategies (managerId) {
        const strategies = JSON.parse(localStorage.getItem("strategies") || "[]");
        return managerId ? strategies.filter((s)=>s.manager_id === managerId) : strategies;
    },
    async createStrategy (payload) {
        const strategies = JSON.parse(localStorage.getItem("strategies") || "[]");
        const now = new Date().toISOString();
        const newStrategy = {
            id: crypto.randomUUID(),
            name: payload.name,
            manager_id: payload.manager_id,
            fund_allocations: payload.fund_allocations,
            rebalancing: payload.rebalancing,
            created_at: now,
            updated_at: now
        };
        strategies.push(newStrategy);
        localStorage.setItem("strategies", JSON.stringify(strategies));
        return newStrategy;
    },
    async updateStrategy (id, updates) {
        const strategies = JSON.parse(localStorage.getItem("strategies") || "[]");
        const idx = strategies.findIndex((s)=>s.id === id);
        if (idx === -1) return null;
        const updated = {
            ...strategies[idx],
            ...updates,
            updated_at: new Date().toISOString()
        };
        strategies[idx] = updated;
        localStorage.setItem("strategies", JSON.stringify(strategies));
        return updated;
    },
    async deleteStrategy (id) {
        const strategies = JSON.parse(localStorage.getItem("strategies") || "[]");
        const filtered = strategies.filter((s)=>s.id !== id);
        localStorage.setItem("strategies", JSON.stringify(filtered));
    },
    // Scheduled reports (demo)
    async getScheduledReports () {
        return JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
    },
    async createScheduledReport (payload) {
        const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
        const now = new Date().toISOString();
        const newReport = {
            id: crypto.randomUUID(),
            name: payload.name,
            type: payload.type,
            target_id: payload.target_id,
            frequency: payload.frequency,
            created_at: now
        };
        reports.push(newReport);
        localStorage.setItem("scheduled_reports", JSON.stringify(reports));
        return newReport;
    },
    async deleteScheduledReport (id) {
        const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
        const filtered = reports.filter((r)=>r.id !== id);
        localStorage.setItem("scheduled_reports", JSON.stringify(filtered));
    },
    // Rebalance state: track last-run per strategy for calendar scheduling
    async getRebalanceStates () {
        return JSON.parse(localStorage.getItem("rebalancer_state") || "[]");
    },
    async getRebalanceState (strategyId) {
        const states = JSON.parse(localStorage.getItem("rebalancer_state") || "[]");
        return states.find((s)=>s.strategy_id === strategyId) || null;
    },
    async setRebalanceState (strategyId, lastRunIso) {
        const states = JSON.parse(localStorage.getItem("rebalancer_state") || "[]");
        const idx = states.findIndex((s)=>s.strategy_id === strategyId);
        if (idx === -1) states.push({
            strategy_id: strategyId,
            last_run: lastRunIso
        });
        else states[idx] = {
            ...states[idx],
            last_run: lastRunIso
        };
        localStorage.setItem("rebalancer_state", JSON.stringify(states));
    },
    // Scheduled reports persistence for manager (demo)
    async getScheduledReports (managerId) {
        const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
        return managerId ? reports.filter((r)=>r.manager_id === managerId) : reports;
    },
    async createScheduledReport (payload) {
        const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
        const now = new Date().toISOString();
        const item = {
            id: crypto.randomUUID(),
            ...payload,
            created_at: now,
            updated_at: now,
            last_run: null
        };
        reports.push(item);
        localStorage.setItem("scheduled_reports", JSON.stringify(reports));
        return item;
    },
    async deleteScheduledReport (id) {
        const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
        const filtered = reports.filter((r)=>r.id !== id);
        localStorage.setItem("scheduled_reports", JSON.stringify(filtered));
    },
    async setScheduledReportLastRun (id, iso) {
        const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]");
        const idx = reports.findIndex((r)=>r.id === id);
        if (idx === -1) return false;
        reports[idx].last_run = iso;
        reports[idx].updated_at = new Date().toISOString();
        localStorage.setItem("scheduled_reports", JSON.stringify(reports));
        return true;
    }
};
}),
"[project]/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/local-storage/db.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize database on mount
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeDatabase"])();
        // Check for existing session
        const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);
    const login = async (email, password)=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].loginUser(email, password);
        setUser(user);
        // Redirect based on role
        if (user.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    };
    const register = async (email, password, fullName, role = "investor")=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].createUser(email, password, fullName, role);
        setUser(user);
        router.push("/dashboard");
    };
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].logout();
        setUser(null);
        router.push("/");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            register,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 56,
        columnNumber: 10
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
}),
"[project]/components/ui/toast.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ToastContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](null);
function ToastProvider({ children }) {
    const [toasts, setToasts] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const toast = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((t)=>{
        const id = crypto.randomUUID();
        setToasts((s)=>[
                ...s,
                {
                    id,
                    ...t
                }
            ]);
        // auto-remove after 4s
        setTimeout(()=>setToasts((s)=>s.filter((x)=>x.id !== id)), 4000);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            toast
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 right-4 flex flex-col gap-2 z-50",
                children: toasts.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-[240px] max-w-sm rounded-md bg-white shadow-lg border px-4 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-sm",
                                children: t.title
                            }, void 0, false, {
                                fileName: "[project]/components/ui/toast.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this),
                            t.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600",
                                children: t.description
                            }, void 0, false, {
                                fileName: "[project]/components/ui/toast.tsx",
                                lineNumber: 28,
                                columnNumber: 31
                            }, this)
                        ]
                    }, t.id, true, {
                        fileName: "[project]/components/ui/toast.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ui/toast.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
function useToast() {
    const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
}),
"[project]/components/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/theme-provider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a7ec5983._.js.map