# FinPlan - Personal Finance Calculator

## Summary

FinPlan is a comprehensive web-based personal finance application designed to help users make informed financial decisions. The platform features four powerful interactive calculators for investment growth analysis, retirement planning, mortgage estimation, and auto loan calculations. Built with a modern, intuitive interface inspired by Personal Capital and Mint, FinPlan provides detailed visualizations, customizable parameters, and actionable insights. Users can authenticate securely with Replit Auth (including Google SSO), manage their profile settings, and share feedback within the community.

## Getting Started

### Prerequisites
- Node.js (included in Replit environment)
- PostgreSQL database (automatically provisioned in Replit)

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:push
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5000` and automatically open in your browser.

### Build for Production
```bash
npm run build
```

## Features & Usage Guide

### 1. Dashboard
The landing page provides an overview of all available tools with a hero section and quick navigation cards.

- **Start Calculating Button**: Jump directly to the Compound Interest Calculator
- **Tool Cards**: Four interactive cards representing each calculator tool - click any card to navigate to that calculator
- **Smooth Animations**: Cards scale up slightly on hover for better visual feedback

### 2. Compound Interest Calculator
Calculate investment growth with the power of compounding over time.

**Parameters:**
- **Initial Investment**: Starting amount in dollars (currency)
- **Monthly Contribution**: Additional amount invested each month (optional)
- **Annual Return Rate**: Expected annual percentage return on investment
- **Time Period**: Duration in years
- **Compounding Frequency**: How often interest is compounded (annual, semi-annual, quarterly, monthly, daily)

**Features:**
- Real-time calculations as you adjust parameters
- Interactive line chart showing growth over time
- Detailed breakdown of principal vs. interest earned
- Monthly/annual views for detailed analysis

### 3. Retirement Withdrawal Calculator (4% Rule)
Plan your retirement withdrawals using the popular 4% safe withdrawal rate strategy.

**Parameters:**
- **Retirement Portfolio**: Total retirement savings amount
- **Annual Withdrawal Amount**: How much you plan to withdraw each year
- **Annual Return Rate**: Expected annual portfolio growth
- **Years in Retirement**: How long you expect retirement to last

**Features:**
- Visual timeline showing portfolio balance year by year
- Determines if your portfolio will sustain your retirement
- Identifies safe vs. risky withdrawal scenarios
- Year-by-year balance breakdown table

### 4. Mortgage Calculator
Estimate monthly mortgage payments and visualize the breakdown of principal and interest.

**Parameters:**
- **Home Price**: Total purchase price of the property
- **Down Payment**: Initial payment amount
- **Interest Rate**: Annual mortgage interest rate
- **Loan Term**: Length of the loan in years
- **Optional Costs**:
  - Property Tax (annual)
  - Home Insurance (annual)
  - HOA Fees (monthly)
  - Mello-Roos (annual)

**Features:**
- Real-time monthly payment calculation including all costs
- Visual breakdown of principal vs. interest
- Annual and monthly amortization schedules
- Year dividers with hover tooltips in monthly view
- Clear display of total interest paid over the life of the loan

### 5. Auto Loan Calculator
Calculate car payment financing considering trade-ins, down payments, and taxes.

**Parameters:**
- **Vehicle Price**: MSRP or purchase price
- **Trade-In Value**: Value of vehicle being traded in (optional)
- **Down Payment**: Initial payment amount
- **Interest Rate**: Loan APR percentage
- **Loan Term**: Months (typically 24-84)
- **Tax Rate**: Sales tax percentage

**Features:**
- Automatic calculation of amount financed
- Interactive pie chart showing payment breakdown
- Monthly and annual amortization views
- Detailed payment schedule table
- Total cost analysis

### 6. Feedback System
Share your thoughts, suggestions, or report issues with the FinPlan community.

**Posting Feedback:**
- Enter your comment in the text field
- Optionally provide your name and email (or post anonymously)
- If logged in, your name and email auto-populate and cannot be edited in the form
- Check "Post anonymously" to submit without identification
- Click "Submit Feedback" to share

**Viewing Feedback:**
- Browse community feedback in the infinite-scroll chat interface
- See timestamps for when feedback was posted
- Anonymous posts show "Anonymous" as the poster name

### 7. Authentication & Profile Management

**Logging In:**
- Click the profile avatar icon in the top right (desktop) or menu (mobile)
- Select "Log in" to authenticate with Replit Auth
- Sign in with your Replit account or use Google SSO
- Your profile information is securely stored

**Profile Settings:**
- Navigate to Settings from the profile dropdown menu
- Edit your first and last name
- View your email address (cannot be changed)
- View your profile avatar if available

**Logging Out:**
- Click the profile avatar and select "Log out"
- Your session will be terminated securely

## Calculator Features

### All Calculators Include:
- **Interactive Controls**: Slider and input field combinations for easy parameter adjustment
- **Real-time Calculations**: Results update instantly as you modify values
- **Helpful Tooltips**: Hover over field labels to see explanations of each parameter
- **Data Visualization**: Charts and tables for comprehensive analysis
- **Responsive Design**: Fully functional on desktop and mobile devices

### Tooltips
Every input field includes a helpful tooltip accessible by hovering over the info icon. These provide:
- Clear explanation of what each parameter represents
- How the parameter affects the calculation
- Typical ranges or examples

## Technology Stack

**Frontend:**
- React with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Wouter for routing
- React Query for state management
- Shadcn/ui components

**Backend:**
- Express.js
- Node.js
- Passport.js for authentication

**Database:**
- PostgreSQL with Drizzle ORM

**Authentication:**
- Replit Auth with OpenID Connect
- Session management with secure cookies

## Tips for Best Results

1. **Investment Planning**: Use realistic return rates based on historical market performance (stocks ~7-10%, bonds ~3-5%)

2. **Retirement Planning**: The 4% rule is a guideline; consult with a financial advisor for personalized advice

3. **Mortgage Calculations**: Include all additional costs (property tax, insurance, HOA) for accurate monthly payment estimates

4. **Auto Loans**: Factor in insurance costs when budgeting for a vehicle purchase

5. **Community Feedback**: Help improve FinPlan by sharing your experience and suggestions in the feedback section

## Support

For issues, feature requests, or feedback about FinPlan, visit the Feedback section within the application or contact support through the profile settings menu.

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Built with**: Replit
