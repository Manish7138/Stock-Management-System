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
"[project]/Downloads/second/lib/local-storage/db.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    }
};
}),
"[project]/Downloads/second/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/lib/local-storage/db.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize database on mount
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeDatabase"])();
        // Check for existing session
        const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);
    const login = async (email, password)=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].loginUser(email, password);
        setUser(user);
        // Redirect based on role
        if (user.role === "admin") {
            router.push("/admin");
        } else if (user.role === "portfolio_manager") {
            router.push("/manager");
        } else {
            router.push("/dashboard");
        }
    };
    const register = async (email, password, fullName, role = "investor")=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].createUser(email, password, fullName, role);
        setUser(user);
        router.push("/dashboard");
    };
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalDB"].logout();
        setUser(null);
        router.push("/");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            register,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Downloads/second/lib/auth-context.tsx",
        lineNumber: 58,
        columnNumber: 10
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
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

//# sourceMappingURL=%5Broot-of-the-server%5D__e9df68ff._.js.map