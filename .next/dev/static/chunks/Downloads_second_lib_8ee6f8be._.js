(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/second/lib/local-storage/db.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Check if already initialized
    if (localStorage.getItem("db_initialized")) return;
    // Sample mutual funds
    const funds = [
        {
            id: "1",
            fund_name: "Blue Chip Equity Fund",
            fund_code: "BCEF001",
            fund_type: "equity",
            objective: "Long-term capital appreciation through investments in large-cap stocks",
            benchmark: "NIFTY 50",
            expense_ratio: 0.75,
            minimum_investment: 5000,
            risk_level: "medium",
            nav: 15.42,
            aum: 500000000,
            inception_date: "2020-01-15",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "2",
            fund_name: "Growth Opportunities Fund",
            fund_code: "GOF002",
            fund_type: "equity",
            objective: "Aggressive growth through mid and small-cap stocks",
            benchmark: "NIFTY Midcap 100",
            expense_ratio: 1.25,
            minimum_investment: 3000,
            risk_level: "high",
            nav: 22.18,
            aum: 250000000,
            inception_date: "2019-06-01",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "3",
            fund_name: "Stable Income Debt Fund",
            fund_code: "SIDF003",
            fund_type: "debt",
            objective: "Regular income with capital preservation through debt securities",
            benchmark: "CRISIL Composite Bond Index",
            expense_ratio: 0.5,
            minimum_investment: 1000,
            risk_level: "low",
            nav: 11.87,
            aum: 750000000,
            inception_date: "2018-03-20",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "4",
            fund_name: "Balanced Hybrid Fund",
            fund_code: "BHF004",
            fund_type: "hybrid",
            objective: "Balanced portfolio of equity and debt for moderate risk-return",
            benchmark: "70% NIFTY 50 + 30% CRISIL",
            expense_ratio: 1.0,
            minimum_investment: 2500,
            risk_level: "medium",
            nav: 18.95,
            aum: 400000000,
            inception_date: "2020-09-10",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "5",
            fund_name: "Technology Sector Fund",
            fund_code: "TSF005",
            fund_type: "sector",
            objective: "Investment in technology and IT sector companies",
            benchmark: "NIFTY IT Index",
            expense_ratio: 1.5,
            minimum_investment: 5000,
            risk_level: "high",
            nav: 28.34,
            aum: 180000000,
            inception_date: "2021-02-15",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: "6",
            fund_name: "Index Fund 50",
            fund_code: "IF50006",
            fund_type: "index",
            objective: "Passive investment tracking NIFTY 50 index",
            benchmark: "NIFTY 50",
            expense_ratio: 0.25,
            minimum_investment: 1000,
            risk_level: "medium",
            nav: 13.67,
            aum: 900000000,
            inception_date: "2017-11-01",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    // Generate NAV history for each fund (last 30 days)
    const navHistory = [];
    funds.forEach((fund)=>{
        for(let i = 0; i < 30; i++){
            const date = new Date();
            date.setDate(date.getDate() - i);
            const variation = (Math.random() - 0.5) * 0.5;
            navHistory.push({
                id: `nav-${fund.id}-${i}`,
                fund_id: fund.id,
                nav: fund.nav + variation * (i / 30),
                date: date.toISOString().split("T")[0]
            });
        }
    });
    // Generate performance metrics
    const performance = [];
    const periods = [
        "1D",
        "1W",
        "1M",
        "3M",
        "6M",
        "1Y",
        "3Y",
        "5Y"
    ];
    funds.forEach((fund)=>{
        periods.forEach((period, index)=>{
            const baseReturn = [
                0.5,
                1.2,
                3.5,
                8.2,
                12.5,
                18.3,
                35.7,
                68.4
            ][index];
            performance.push({
                id: `perf-${fund.id}-${period}`,
                fund_id: fund.id,
                period,
                returns: baseReturn + (Math.random() - 0.5) * 5,
                sharpe_ratio: 1.2 + Math.random() * 0.5,
                alpha: Math.random() * 2 - 0.5,
                beta: 0.9 + Math.random() * 0.3,
                standard_deviation: Math.random() * 5 + 10
            });
        });
    });
    // Store in localStorage
    localStorage.setItem("mutual_funds", JSON.stringify(funds));
    localStorage.setItem("nav_history", JSON.stringify(navHistory));
    localStorage.setItem("fund_performance", JSON.stringify(performance));
    // Sample users for demo mode (Investor, Portfolio Manager, Admin)
    const now = new Date().toISOString();
    const users = [
        {
            id: "u-investor-1",
            email: "investor@example.com",
            password: "password",
            full_name: "Demo Investor",
            role: "investor",
            created_at: now
        },
        {
            id: "u-manager-1",
            email: "manager@example.com",
            password: "password",
            full_name: "Demo Manager",
            role: "portfolio_manager",
            created_at: now
        },
        {
            id: "u-admin-1",
            email: "admin@example.com",
            password: "password",
            full_name: "System Admin",
            role: "admin",
            created_at: now
        }
    ];
    // Sample investments and transactions to show activity for each role
    const investments = [
        {
            id: "inv-1",
            investor_id: "u-investor-1",
            fund_id: "1",
            units: 100,
            average_nav: 15.42,
            total_invested: 1542,
            current_value: 1542,
            created_at: now,
            updated_at: now
        }
    ];
    const transactions = [
        // Investor transactions
        {
            id: "tx-inv-1",
            investor_id: "u-investor-1",
            fund_id: "1",
            transaction_type: "buy",
            amount: 5000,
            units: 5000 / 15.42,
            nav: 15.42,
            status: "completed",
            processed_at: now,
            created_at: now
        },
        {
            id: "tx-inv-2",
            investor_id: "u-investor-1",
            fund_id: "2",
            transaction_type: "buy",
            amount: 3000,
            units: 3000 / 22.18,
            nav: 22.18,
            status: "completed",
            processed_at: now,
            created_at: now
        },
        // Manager transactions (demo activity)
        {
            id: "tx-mgr-1",
            investor_id: "u-manager-1",
            fund_id: "2",
            transaction_type: "sell",
            amount: 10000,
            units: 10000 / 22.18,
            nav: 22.18,
            status: "completed",
            processed_at: now,
            created_at: now
        },
        // Admin transactions (demo activity)
        {
            id: "tx-adm-1",
            investor_id: "u-admin-1",
            fund_id: "3",
            transaction_type: "buy",
            amount: 2000,
            units: 2000 / 11.87,
            nav: 11.87,
            status: "completed",
            processed_at: now,
            created_at: now
        }
    ];
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("investments", JSON.stringify(investments));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("investor_profiles", JSON.stringify([]));
    localStorage.setItem("watchlist", JSON.stringify([]));
    localStorage.setItem("db_initialized", "true");
    console.log("[local] Local database initialized with sample data");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/second/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/lib/local-storage/db.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/second/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Initialize database on mount
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeDatabase"])();
            // Check for existing session
            const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalDB"].getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalDB"].loginUser(email, password);
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
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalDB"].createUser(email, password, fullName, role);
        setUser(user);
        router.push("/dashboard");
    };
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$lib$2f$local$2d$storage$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalDB"].logout();
        setUser(null);
        router.push("/");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
_s(AuthProvider, "J17Kp8z+0ojgAqGoY5o3BCjwWms=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$second$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_second_lib_8ee6f8be._.js.map