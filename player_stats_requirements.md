# IPL Auction Portal: Auction Presenter View Data Specification

This document defines the exact data points and layout for the **Auction Presenter View** (TV Broadcast Style). These fields are designed to match a professional sports broadcast experience.

---

## 1. Primary Player Data (Header Box)
This data is always visible at the top of the screen when a player is active.

- **Player Identity**:
  - `name`: Full Name (e.g., "Virat Kohli")
  - `image`: Professional Headshot (with fallback to placeholder)
  - `role`: Primary Role (e.g., "BATSMAN")
  - `nationality`: Country of Origin
  - `age`: Current Age
- **Styles**:
  - `battingStyle`: (e.g., "Right-handed Batsman")
  - `bowlingStyle`: (e.g., "Right-arm Offbreak")

---

## 2. Dynamic Auction Data (Bid Banner)
Live data that updates as the auction progresses.

- **Pricing**:
    - `basePrice`: The starting price in Lakhs (e.g., "₹200L")
    - `currentBid`: The highest active bid (e.g., "₹550L")
- **Bidding Team (Live)**:
    - `teamName`: Name of the current highest bidder
    - `teamLogo`: Logo of the current highest bidder
- **Auction Status**:
    - `status`: Indicator for "LIVE", "PAUSED", "SOLD", or "UNSOLD"

---

## 3. Career Statistics (Stats Bar)
The following stats are rendered dynamically based on the player's primary **Role**.

### 🏏 Batsman
| Field | Label | Description |
| :--- | :--- | :--- |
| `matches` | **Matches** | Total Career Games |
| `runs` | **Runs** | Total Career Runs |
| `average` | **Average** | Batting Consistency |
| `strike_rate` | **S/R** | Scoring Efficiency |

### ⚾ Bowler
| Field | Label | Description |
| :--- | :--- | :--- |
| `matches` | **Matches** | Total Career Games |
| `wickets` | **Wickets** | Total Career Breakthroughs |
| `economy` | **Economy** | Run Containment |
| `average` | **Average** | Runs Conceded per Wicket |

### 🌟 All-Rounder
| Field | Label | Description |
| :--- | :--- | :--- |
| `runs` | **Runs** | Batting Volume |
| `wickets` | **Wickets** | Bowling Volume |
| `strike_rate` | **S/R** | Batting Efficiency |
| `economy` | **Economy** | Bowling Efficiency |

### 🧤 Wicketkeeper
| Field | Label | Description |
| :--- | :--- | :--- |
| `matches` | **Matches** | Total Career Games |
| `runs` | **Runs** | Batting Volume |
| `strike_rate` | **S/R** | Scoring Speed |
| `points` | **Points** | Performance Rating (Catch/Stump index) |

---

## 4. Team Purse Status (Sidebar/Ticker)
Global data visible to track remaining budget across all franchises.

- `teamName`: Full Franchise Name
- `purse_balance`: Remaining budget in Crores/Lakhs
- `players_count`: Number of players currently in the squad
- `purse_usage`: Visual progress bar (0-100% of budget)
