#!/usr/bin/env python3
"""
FastAPI server for UI Accessibility Analyzer
Simplified version focusing only on UI modifications.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os

from ui_accessibility_analyzer import (
    UIAccessibilityAnalyzer, 
    DisabilityType
)

# Initialize FastAPI app
app = FastAPI(
    title="UI Accessibility Analyzer API",
    description="API for analyzing UI components and generating accessibility modifications",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AnalyzeRequest(BaseModel):
    disability_type: str

class UIModificationResponse(BaseModel):
    disability_type: str
    css_modifications: str
    react_modifications: Dict[str, Any]
    summary: str

class ComponentDefinition(BaseModel):
    component_name: str
    element_type: str
    current_value: str
    description: str
    css_property: str
    importance: str

class UpdateComponentsRequest(BaseModel):
    components: Dict[str, List[ComponentDefinition]]

# Global analyzer instance
analyzer: Optional[UIAccessibilityAnalyzer] = None

def get_analyzer() -> UIAccessibilityAnalyzer:
    """Get or create the analyzer instance"""
    global analyzer
    if analyzer is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="OPENAI_API_KEY environment variable not set"
            )
        analyzer = UIAccessibilityAnalyzer(api_key)
    return analyzer

@app.on_event("startup")
async def startup_event():
    """Initialize the analyzer on startup"""
    try:
        get_analyzer()
        print("✅ UI Accessibility Analyzer initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize analyzer: {e}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "UI Accessibility Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/analyze",
            "css": "/css/{disability_type}",
            "react": "/react/{disability_type}",
            "disability_types": "/disability-types",
            "update_components": "/components/update"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        get_analyzer()
        return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/disability-types")
async def get_disability_types():
    """Get list of supported disability types"""
    return {
        "disability_types": [
            {
                "value": dt.value,
                "name": dt.value.replace("_", " ").title()
            }
            for dt in DisabilityType
        ]
    }

@app.post("/analyze", response_model=UIModificationResponse)
async def analyze_disability_type(request: AnalyzeRequest):
    """Analyze UI modifications for a specific disability type"""
    try:
        # Validate disability type
        try:
            disability_type = DisabilityType(request.disability_type)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid disability type: {request.disability_type}. Valid types: {[dt.value for dt in DisabilityType]}"
            )
        
        # Get analyzer and perform analysis
        analyzer = get_analyzer()
        profile = analyzer.analyze_disability_type(disability_type)
        
        # Generate CSS and React modifications
        css = analyzer.generate_css_modifications(profile)
        react_mods = analyzer.generate_react_modifications(profile)
        
        return UIModificationResponse(
            disability_type=profile.disability_type.value,
            css_modifications=css,
            react_modifications=react_mods,
            summary=profile.summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/css/{disability_type}")
async def get_css_modifications(disability_type: str):
    """Get CSS modifications for a disability type"""
    try:
        # Validate disability type
        try:
            dt = DisabilityType(disability_type)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid disability type: {disability_type}"
            )
        
        # Get analyzer and generate CSS
        analyzer = get_analyzer()
        profile = analyzer.analyze_disability_type(dt)
        css = analyzer.generate_css_modifications(profile)
        
        return {
            "disability_type": disability_type,
            "css": css,
            "css_class": f"persona-{disability_type.replace('_', '-')}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate CSS: {str(e)}")

@app.get("/react/{disability_type}")
async def get_react_modifications(disability_type: str):
    """Get React modifications for a disability type"""
    try:
        # Validate disability type
        try:
            dt = DisabilityType(disability_type)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid disability type: {disability_type}"
            )
        
        # Get analyzer and generate React modifications
        analyzer = get_analyzer()
        profile = analyzer.analyze_disability_type(dt)
        react_mods = analyzer.generate_react_modifications(profile)
        
        return {
            "disability_type": disability_type,
            "modifications": react_mods
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate React modifications: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
