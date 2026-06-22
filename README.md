# Stock Management System

A full-stack mutual fund management platform built with Next.js, TypeScript, and Tailwind CSS. The system supports three different user roles — investors, portfolio managers, and administrators — each with their own features and dashboards.

## What is this project?

Stock Management System is a web-based platform for managing mutual fund investments. It lets investors browse and purchase mutual funds, track their portfolio performance in real-time, and get personalized investment recommendations. Portfolio managers can oversee their assigned funds and update key metrics, while administrators have full control over the system — managing users, funds, and monitoring all activities through audit logs.

The platform works both online (with Supabase PostgreSQL) and offline (using browser storage for demo purposes), making it flexible for development and testing.

## Features

### For Investors
- **Portfolio Management** — View all your investments in one place with real-time valuations and gain/loss calculations
- **Fund Discovery** — Browse mutual funds, filter by type and risk level, and get detailed information about each fund
- **Risk Assessment** — Take a questionnaire to determine your investment style, then get personalized fund recommendations
- **Buy & Sell** — Purchase or liquidate fund units through a simple transaction interface
- **Performance Tracking** — See how your portfolio is growing with interactive charts and historical data


### For Administrators
- **Dashboard** — Get a real-time overview of the entire system (total users, active funds, transaction volume, AUM)
- **User Management** — View all users, change their roles, and manage account status
- **Fund Administration** — Create new funds, set properties, and assign portfolio managers
- **Reports** — Generate transaction reports, performance analytics, and user activity summaries
- **Audit Logs** — See a complete record of everything that happens in the system

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 16 with React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Database** | Supabase PostgreSQL (or localStorage for demo) |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **Notifications** | Sonner |

## Getting Started

### Requirements
- Node.js 18 or higher
- npm or pnpm

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in your browser:**
   ```
   http://localhost:3000
   ```

### Demo Accounts

You can log in immediately with these test credentials:

**Investor:**
- Email: `investor@example.com`
- Password: `password123`

**Admin:**
- Email: `admin@example.com`
- Password: `password123`

**Portfolio Manager:**
- Email: `manager@example.com`
- Password: `password123`

## Project Structure

```
Stock Management System/
├── app/                           # Next.js App Router pages
│   ├── admin/                    # Admin dashboard pages
│   ├── dashboard/                # Investor dashboard pages
│   ├── auth/                     # Login and registration pages
│   ├── api/                      # API routes
│   └── layout.tsx                # Root layout with providers
│
├── components/
│   ├── ui/                       # Reusable UI components (buttons, cards, etc.)
│   ├── admin/                    # Admin-specific components
│   ├── investor/                 # Investor-specific components
│   └── [other]                   # Shared components
│
├── lib/
│   ├── auth-context.tsx          # Authentication and user session
│   ├── local-storage/            # Demo database (works without backend)
│   └── [utilities]               # Helper functions
│
├── scripts/                       # Database migration scripts
└── public/                        # Static files and images
```

## How It Works

### Authentication
When you log in, the system checks your credentials and remembers your role (investor, portfolio manager, or admin). You're then redirected to the appropriate dashboard for your role.

### Data Storage
- **Demo Mode** — Uses browser storage (localStorage/IndexedDB) with sample data. This is the default, so you can run the app immediately without a backend.
- **Production Mode** — Can connect to Supabase PostgreSQL for real data persistence. Migration scripts are included in `scripts/`.

### Role-Based Access
Each role has different features and pages. The system automatically blocks access to pages you shouldn't see based on your role.

## Running Other Commands

```bash
# Check code quality with ESLint
npm run lint

# Build for production
npm run build

# Run the production build locally
npm start
```

## Key Features Explained

### Real-Time Portfolio Tracking
When you log in as an investor, you see your total invested amount, current portfolio value, and overall gains or losses. This updates based on simulated NAV changes.

### Personalized Recommendations
The risk assessment questionnaire learns about your investment style, experience level, and goals. The system then suggests mutual funds that match your profile.

### Complete Transaction History
Every buy or sell you make is recorded. You can see when transactions happened, how much they were for, and their current status.

### Admin Audit Logs
Everything that happens in the system — logins, fund updates, role changes — gets recorded. Administrators can review this to ensure the system is being used properly.

## Database Schema

The system uses PostgreSQL with these main tables:
- **profiles** — User accounts with email, name, and role
- **mutual_funds** — Available funds with NAV, expense ratio, and risk level
- **investments** — Your holdings (which funds you own and how many units)
- **transactions** — Record of all buy/sell orders
- **nav_history** — Historical NAV data for charting
- **audit_logs** — Complete activity log of everything in the system

## Notes

- The app works in the browser — no login required initially, just use the demo credentials
- The `lib/local-storage/db.ts` file is the key to how data is stored and retrieved
- UI components are all in `components/ui/` and follow consistent patterns
- TypeScript helps catch bugs before they become problems

## What's Next?

Future versions could include:
- Real payment processing
- Live market data feeds
- Advanced trading strategies
- Mobile app version
- API for external integrations

## License

This project is built for educational purposes.
