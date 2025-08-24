#!/usr/bin/env python3
"""
Simple test script for the UI Accessibility Analyzer API
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_disability_types():
    """Test disability types endpoint"""
    print("🔍 Testing disability types endpoint...")
    response = requests.get(f"{BASE_URL}/disability-types")
    print(f"Status: {response.status_code}")
    print("Available disability types:")
    for dt in response.json()["disability_types"]:
        print(f"  - {dt['value']}: {dt['name']}")
    print()

def test_analyze_disability():
    """Test analyze endpoint"""
    print("🔍 Testing analyze endpoint for dyslexia...")
    data = {"disability_type": "dyslexia"}
    response = requests.post(f"{BASE_URL}/analyze", json=data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Disability Type: {result['disability_type']}")
        print(f"Summary: {result['summary']}")
        print(f"CSS Class: persona-{result['disability_type'].replace('_', '-')}")
        print("\nCSS Modifications:")
        print(result['css_modifications'])
        print("\nReact Modifications:")
        print(json.dumps(result['react_modifications'], indent=2))
    else:
        print(f"Error: {response.text}")
    print()

def test_css_endpoint():
    """Test CSS endpoint"""
    print("🔍 Testing CSS endpoint for low_vision...")
    response = requests.get(f"{BASE_URL}/css/low_vision")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Disability Type: {result['disability_type']}")
        print(f"CSS Class: {result['css_class']}")
        print("\nCSS:")
        print(result['css'])
    else:
        print(f"Error: {response.text}")
    print()

def test_react_endpoint():
    """Test React endpoint"""
    print("🔍 Testing React endpoint for cognitive_impairment...")
    response = requests.get(f"{BASE_URL}/react/cognitive_impairment")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Disability Type: {result['disability_type']}")
        print("\nReact Modifications:")
        print(json.dumps(result['modifications'], indent=2))
    else:
        print(f"Error: {response.text}")
    print()

def test_update_components():
    """Test component update endpoint"""
    print("🔍 Testing component update endpoint...")
    
    # Example new component
    new_components = {
        "typography": [
            {
                "component_name": "custom-heading",
                "element_type": "heading",
                "current_value": "text-3xl font-bold",
                "description": "Custom heading style",
                "css_property": "font-size",
                "importance": "medium"
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/components/update", json={"components": new_components})
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Message: {result['message']}")
        print(f"Updated categories: {result['updated_categories']}")
        print(f"Total categories: {result['total_categories']}")
    else:
        print(f"Error: {response.text}")
    print()

def main():
    """Run all tests"""
    print("🚀 Testing UI Accessibility Analyzer API")
    print("=" * 50)
    
    try:
        test_health()
        test_disability_types()
        test_analyze_disability()
        test_css_endpoint()
        test_react_endpoint()
        test_update_components()
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server.")
        print("Make sure the server is running with: python api_server.py")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    main()
