#!/usr/bin/env python3
"""
IPL Auction Portal - System Health Check
Tests all components to ensure full integration is working
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:8000"
ENDPOINTS = {
    "health": "/api/health",
    "teams": "/api/teams",
    "players": "/api/players",
    "auction_status": "/api/auction/status",
}

class HealthCheck:
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0

    def test_endpoint(self, name, url):
        """Test if an endpoint is accessible and returns valid data"""
        try:
            response = requests.get(f"{API_BASE_URL}{url}", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                self.results.append({
                    "name": name,
                    "status": "✅ PASS",
                    "url": url,
                    "response_code": response.status_code,
                    "data_items": len(data) if isinstance(data, list) else 1
                })
                self.passed += 1
                return True
            else:
                self.results.append({
                    "name": name,
                    "status": "❌ FAIL",
                    "url": url,
                    "response_code": response.status_code,
                    "error": "Invalid status code"
                })
                self.failed += 1
                return False
                
        except requests.exceptions.ConnectionError:
            self.results.append({
                "name": name,
                "status": "❌ FAIL",
                "url": url,
                "error": "Connection refused - Backend not running?"
            })
            self.failed += 1
            return False
        except Exception as e:
            self.results.append({
                "name": name,
                "status": "❌ FAIL",
                "url": url,
                "error": str(e)
            })
            self.failed += 1
            return False

    def test_teams_data(self):
        """Test if teams data is properly seeded"""
        try:
            response = requests.get(f"{API_BASE_URL}/api/teams", timeout=5)
            if response.status_code == 200:
                data = response.json()
                teams_count = len(data.get("teams", []))
                
                if teams_count >= 10:
                    self.results.append({
                        "name": "Teams Database",
                        "status": f"✅ PASS ({teams_count} teams)",
                        "data": teams_count
                    })
                    self.passed += 1
                    return True
                else:
                    self.results.append({
                        "name": "Teams Database",
                        "status": f"⚠️  WARNING ({teams_count} teams, expected 10)",
                        "data": teams_count
                    })
                    self.failed += 1
                    return False
        except Exception as e:
            self.results.append({
                "name": "Teams Database",
                "status": "❌ FAIL",
                "error": str(e)
            })
            self.failed += 1
            return False

    def test_players_data(self):
        """Test if players data is properly seeded"""
        try:
            response = requests.get(f"{API_BASE_URL}/api/players", timeout=5)
            if response.status_code == 200:
                data = response.json()
                players_count = len(data.get("players", []))
                
                if players_count >= 25:
                    self.results.append({
                        "name": "Players Database",
                        "status": f"✅ PASS ({players_count} players)",
                        "data": players_count
                    })
                    self.passed += 1
                    return True
                else:
                    self.results.append({
                        "name": "Players Database",
                        "status": f"⚠️  WARNING ({players_count} players, expected 25)",
                        "data": players_count
                    })
                    self.failed += 1
                    return False
        except Exception as e:
            self.results.append({
                "name": "Players Database",
                "status": "❌ FAIL",
                "error": str(e)
            })
            self.failed += 1
            return False

    def print_results(self):
        """Print results in a formatted table"""
        print("\n" + "="*70)
        print("🏏 IPL AUCTION PORTAL - SYSTEM HEALTH CHECK")
        print("="*70)
        print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 API Base URL: {API_BASE_URL}")
        print("-"*70)

        for result in self.results:
            print(f"\n📌 {result.get('name', 'Unknown')}")
            print(f"   Status: {result.get('status', 'Unknown')}")
            
            if 'url' in result:
                print(f"   Endpoint: {result['url']}")
            
            if 'response_code' in result:
                print(f"   Response: {result['response_code']}")
            
            if 'data_items' in result:
                print(f"   Items: {result['data_items']}")
            
            if 'data' in result:
                print(f"   Data Count: {result['data']}")
            
            if 'error' in result:
                print(f"   Error: {result['error']}")

        print("\n" + "="*70)
        print("📊 SUMMARY")
        print("="*70)
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        total = self.passed + self.failed
        if total > 0:
            success_rate = (self.passed / total) * 100
            print(f"📈 Success Rate: {success_rate:.1f}%")
        print("="*70)

        if self.failed == 0:
            print("\n🎉 ALL TESTS PASSED! System is fully operational.\n")
            return 0
        else:
            print(f"\n⚠️  {self.failed} test(s) failed. Check errors above.\n")
            return 1

def main():
    print("\n🔍 Starting system health check...\n")
    
    checker = HealthCheck()
    
    # Test all endpoints
    print("Testing API Endpoints...")
    for name, endpoint in ENDPOINTS.items():
        checker.test_endpoint(name.replace('_', ' ').title(), endpoint)
    
    # Test data
    print("Testing Database...")
    checker.test_teams_data()
    checker.test_players_data()
    
    # Print results
    exit_code = checker.print_results()
    sys.exit(exit_code)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏸️  Health check interrupted by user.\n")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}\n")
        sys.exit(1)
