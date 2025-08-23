from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import json
import os
from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field, validator
from enum import Enum

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///accessible_cms.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

db = SQLAlchemy(app)
CORS(app)


from openai import OpenAI

# Initialize OpenAI client with proper error handling
try:
    # Try to get API key from environment first, then fallback to hardcoded
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        # Fallback to hardcoded API key
        api_key = "sk-or-v1-ab3df1cef88f344f15e673778151efd30a2d3e09f82221e112806bd5c0847ff87"
        print("🔑 Using hardcoded API key from code")
    
    if api_key and api_key != 'dummy-key-for-testing':
        # Use real API key
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        print("✅ OpenAI client initialized with real API key")
    else:
        # Use dummy client for testing
        client = None
        print("⚠️  Using dummy OpenAI client for testing")
        
except Exception as e:
    print(f"⚠️  OpenAI client initialization failed: {e}")
    print("   Continuing with dummy client for testing")
    client = None


# Enums for disability types
class DisabilityType(str, Enum):
    WHEELCHAIR_USER = "wheelchair_user"
    DYSLEXIA = "dyslexia"
    COGNITIVE_IMPAIRMENT = "cognitive_impairment"
    ANXIETY_TRAVEL_FEAR = "anxiety_travel_fear"
    LOW_VISION = "low_vision"

# Pydantic Models for Input Validation and Content Structure

class HotelContentModel(BaseModel):
    """Pydantic model for hotel content - used for both input and all disability versions"""
    name: str = Field(..., description="Hotel name")
    location: str = Field(..., description="Hotel location")
    coordinates: Optional[str] = Field(None, description="GPS coordinates")
    prices: Dict[str, Union[str, float, int]] = Field(default_factory=dict, description="Pricing information")
    accessibility_features: Dict[str, str] = Field(default_factory=dict, description="Accessibility features")
    images: List[str] = Field(default_factory=list, description="Image URLs")
    cancellation_conditions: str = Field("", description="Cancellation policy")
    meal_times: Dict[str, str] = Field(default_factory=dict, description="Meal service times")
    parking: str = Field("", description="Parking information")
    amenities: Dict[str, str] = Field(default_factory=dict, description="Hotel amenities")
    nearby_accessible_places: List[Dict[str, str]] = Field(default_factory=list, description="Nearby accessible venues")
    accessibility_notes: str = Field("", description="Additional accessibility information")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class TourContentModel(BaseModel):
    """Pydantic model for tour content - used for both input and all disability versions"""
    name: str = Field(..., description="Tour name")
    description: str = Field(..., description="Tour description")
    destinations: List[str] = Field(default_factory=list, description="Tour destinations")
    activities: List[Dict[str, str]] = Field(default_factory=list, description="Tour activities")
    accessibility_features: Dict[str, str] = Field(default_factory=dict, description="Accessibility features for activities")
    photos: List[str] = Field(default_factory=list, description="Photo URLs")
    duration: str = Field("", description="Tour duration")
    itinerary: List[Dict[str, str]] = Field(default_factory=list, description="Detailed itinerary")
    support_services: List[str] = Field(default_factory=list, description="Available support services")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CareServiceContentModel(BaseModel):
    """Pydantic model for care service content - used for both input and all disability versions"""
    name: str = Field(..., description="Service name")
    description: str = Field(..., description="Service description")
    care_types: List[str] = Field(default_factory=list, description="Types of care available")
    staff_qualifications: List[str] = Field(default_factory=list, description="Staff qualifications")
    pricing_insurance: Dict[str, str] = Field(default_factory=dict, description="Pricing and insurance details")
    images: List[str] = Field(default_factory=list, description="Service images")
    emergency_contact: Dict[str, str] = Field(default_factory=dict, description="Emergency contact information")
    accessibility_features: Dict[str, str] = Field(default_factory=dict, description="Service accessibility features")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# AI Prompts for each disability type
ADAPTATION_PROMPTS = {
    DisabilityType.WHEELCHAIR_USER: """
    Adapt this content for wheelchair users by:
    1. Prioritize accessibility features like ramps, elevators, door widths, accessible bathrooms
    2. Highlight mobility-related amenities and services
    3. Emphasize accessibility information for transportation and movement
    4. Focus on barrier-free access details
    5. Maintain all original information but reorganize with accessibility features first
    Return the same JSON structure with reordered and enhanced content for wheelchair accessibility.
    """,
    
    DisabilityType.DYSLEXIA: """
    Adapt this content for people with dyslexia by:
    1. Use simple, clear language with shorter sentences
    2. Avoid complex words - replace with simpler alternatives
    3. Use consistent terminology throughout
    4. Structure information with clear headings and bullet points
    5. Provide explanations for technical terms
    6. Use lowercase where appropriate if specified in user preferences
    Return the same JSON structure maintaining all information but with dyslexia-friendly language.
    """,
    
    DisabilityType.COGNITIVE_IMPAIRMENT: """
    Adapt this content for people with cognitive impairments by:
    1. Use very simple, clear language
    2. Break complex information into smaller, digestible chunks
    3. Use concrete, specific details rather than abstract concepts
    4. Provide step-by-step information where relevant
    5. Emphasize support services and assistance available
    6. Highlight emergency contacts and help resources prominently
    Return the same JSON structure with simplified, concrete language and clear structure.
    """,
    
    DisabilityType.ANXIETY_TRAVEL_FEAR: """
    Adapt this content for people with travel anxiety by:
    1. Emphasize safety features and security measures
    2. Provide detailed, predictable information to reduce uncertainty
    3. Highlight cancellation policies and flexibility options
    4. Emphasize support services and staff availability
    5. Include calming, reassuring language
    6. Provide clear contact information for questions and support
    Return the same JSON structure with reassuring, detailed information that reduces travel anxiety.
    """,
    
    DisabilityType.LOW_VISION: """
    Adapt this content for people with low vision by:
    1. Emphasize audio descriptions and tactile features
    2. Highlight high-contrast visual elements and lighting
    3. Focus on descriptive details about layouts and navigation
    4. Emphasize braille availability and audio guides
    5. Provide detailed verbal descriptions of visual elements
    6. Highlight staff assistance for visual navigation
    Return the same JSON structure with enhanced descriptive content for low vision needs.
    """
}

# Database Models - storing JSON content using Pydantic models
class Hotel(db.Model):
    __tablename__ = 'hotels'
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Original content as JSON (follows HotelContentModel structure)
    original_content = db.Column(db.JSON, nullable=False)
    
    # Adaptive content for each disability type (all follow HotelContentModel structure)
    wheelchair_user_content = db.Column(db.JSON)
    dyslexia_content = db.Column(db.JSON)
    cognitive_impairment_content = db.Column(db.JSON)
    anxiety_travel_fear_content = db.Column(db.JSON)
    low_vision_content = db.Column(db.JSON)

class Tour(db.Model):
    __tablename__ = 'tours'
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Original content as JSON (follows TourContentModel structure)
    original_content = db.Column(db.JSON, nullable=False)
    
    # Adaptive content for each disability type (all follow TourContentModel structure)
    wheelchair_user_content = db.Column(db.JSON)
    dyslexia_content = db.Column(db.JSON)
    cognitive_impairment_content = db.Column(db.JSON)
    anxiety_travel_fear_content = db.Column(db.JSON)
    low_vision_content = db.Column(db.JSON)

class CareService(db.Model):
    __tablename__ = 'care_services'
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Original content as JSON (follows CareServiceContentModel structure)
    original_content = db.Column(db.JSON, nullable=False)
    
    # Adaptive content for each disability type (all follow CareServiceContentModel structure)
    wheelchair_user_content = db.Column(db.JSON)
    dyslexia_content = db.Column(db.JSON)
    cognitive_impairment_content = db.Column(db.JSON)
    anxiety_travel_fear_content = db.Column(db.JSON)
    low_vision_content = db.Column(db.JSON)

# Content Adaptation Service
class ContentAdaptationService:
    @staticmethod
    def adapt_content_for_disability(content_model: BaseModel, disability_type: DisabilityType, model_class: BaseModel) -> Dict:
        """
        Use AI to adapt content for specific disability type while maintaining the same model structure
        """
        try:
            # Check if OpenAI client is available
            if client is None:
                print(f"⚠️  OpenAI client not available, returning original content for {disability_type}")
                return content_model.model_dump()
            
            # Convert pydantic model to dict for AI processing
            content_dict = content_model.model_dump()
            content_str = json.dumps(content_dict, indent=2)
            
            # Get the appropriate prompt
            prompt = ADAPTATION_PROMPTS.get(disability_type, "")
            
            # Create the full prompt
            full_prompt = f"""
            {prompt}
            
            IMPORTANT: You must return content that follows the exact same structure as the input.
            All field names must remain identical. Only modify the content/values, not the structure.
            
            Original Content:
            {content_str}
            
            Please return only valid JSON with the adapted content using the same field structure.
            """
            
            # Call OpenAI API
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an accessibility expert who adapts content for people with disabilities. Always return valid JSON with the exact same structure as input."},
                    {"role": "user", "content": full_prompt}
                ],
                max_tokens=4096,
                temperature=0.3
            )
            
            # Parse the response
            adapted_content = response.choices[0].message.content.strip()
            
            # Clean up the response (remove any markdown formatting)
            if adapted_content.startswith('```json'):
                adapted_content = adapted_content[7:]
            if adapted_content.endswith('```'):
                adapted_content = adapted_content[:-3]
            adapted_content = adapted_content.strip()
            
            # Try to parse and validate as JSON
            try:
                adapted_dict = json.loads(adapted_content)
                
                # Validate using the same pydantic model
                validated_content = model_class(**adapted_dict)
                return validated_content.dict()
                
            except (json.JSONDecodeError, Exception) as parse_error:
                print(f"Failed to parse/validate AI response for {disability_type}: {str(parse_error)}")
                return content_dict
                
        except Exception as e:
            print(f"Error adapting content for {disability_type}: {str(e)}")
            return content_model.dict()

    @staticmethod
    def generate_all_adaptive_content(original_content: BaseModel, model_class: BaseModel) -> Dict:
        """Generate adaptive content for all disability types"""
        adaptive_content = {}
        
        for disability_type in DisabilityType:
            field_name = f'{disability_type.value}_content'
            adaptive_content[field_name] = ContentAdaptationService.adapt_content_for_disability(
                original_content, disability_type, model_class
            )
        
        return adaptive_content

# Helper Functions
def validate_and_create_hotel_content(data: dict) -> HotelContentModel:
    """Validate and create hotel content using Pydantic model"""
    try:
        return HotelContentModel(**data)
    except Exception as e:
        raise ValueError(f"Invalid hotel data: {str(e)}")

def validate_and_create_tour_content(data: dict) -> TourContentModel:
    """Validate and create tour content using Pydantic model"""
    try:
        return TourContentModel(**data)
    except Exception as e:
        raise ValueError(f"Invalid tour data: {str(e)}")

def validate_and_create_care_service_content(data: dict) -> CareServiceContentModel:
    """Validate and create care service content using Pydantic model"""
    try:
        return CareServiceContentModel(**data)
    except Exception as e:
        raise ValueError(f"Invalid care service data: {str(e)}")

# API Routes

# Hotel Management APIs
@app.route('/api/hotels', methods=['POST'])
def create_hotel():
    """Create a new hotel with adaptive content using Pydantic validation"""
    try:
        data = request.json
        
        # Validate input using Pydantic model
        hotel_content = validate_and_create_hotel_content(data)
        
        # Generate adaptive content for all disability types
        adaptive_content = ContentAdaptationService.generate_all_adaptive_content(
            hotel_content, HotelContentModel
        )
        
        # Create hotel record
        hotel = Hotel(
            original_content=hotel_content.model_dump(),
            **adaptive_content
        )
        
        db.session.add(hotel)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Hotel created successfully',
            'hotel_id': hotel.id,
            'content_structure': 'HotelContentModel'
        }), 201
        
    except ValueError as ve:
        return jsonify({
            'success': False,
            'error': f'Validation error: {str(ve)}'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    """Get all hotels with basic info"""
    try:
        hotels = Hotel.query.all()
        hotels_list = []
        
        for hotel in hotels:
            # Extract basic info from original_content
            original = hotel.original_content
            hotels_list.append({
                'id': hotel.id,
                'name': original.get('name', ''),
                'location': original.get('location', ''),
                'coordinates': original.get('coordinates', ''),
                'created_at': hotel.created_at.isoformat(),
                'updated_at': hotel.updated_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'hotels': hotels_list
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    """Get hotel details with optional adaptive content"""
    try:
        disability_type = request.args.get('disability_type')
        
        hotel = Hotel.query.get_or_404(hotel_id)
        
        # Determine which content to return
        if disability_type and disability_type in [dt.value for dt in DisabilityType]:
            # Map the disability type to the correct field name
            field_mapping = {
                'wheelchair_user': 'wheelchair_user_content',
                'dyslexia': 'dyslexia_content',
                'cognitive_impairment': 'cognitive_impairment_content',
                'anxiety_travel_fear': 'anxiety_travel_fear_content',
                'low_vision': 'low_vision_content'
            }
            content_field = field_mapping.get(disability_type)
            if content_field:
                content = getattr(hotel, content_field)
                if not content:
                    content = hotel.original_content
                content_type = f'adaptive_{disability_type}'
            else:
                content = hotel.original_content
                content_type = 'original'
        else:
            content = hotel.original_content
            content_type = 'original'
        
        # Validate content structure
        try:
            validated_content = HotelContentModel(**content)
            content_dict = validated_content.dict()
        except:
            content_dict = content
        
        response_data = {
            'success': True,
            'hotel': {
                'id': hotel.id,
                'content_type': content_type,
                'created_at': hotel.created_at.isoformat(),
                'updated_at': hotel.updated_at.isoformat(),
                **content_dict
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Tour Management APIs
@app.route('/api/tours', methods=['POST'])
def create_tour():
    """Create a new tour with adaptive content using Pydantic validation"""
    try:
        data = request.json
        
        # Validate input using Pydantic model
        tour_content = validate_and_create_tour_content(data)
        
        # Generate adaptive content for all disability types
        adaptive_content = ContentAdaptationService.generate_all_adaptive_content(
            tour_content, TourContentModel
        )
        
        # Create tour record
        tour = Tour(
            original_content=tour_content.model_dump(),
            **adaptive_content
        )
        
        db.session.add(tour)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Tour created successfully',
            'tour_id': tour.id,
            'content_structure': 'TourContentModel'
        }), 201
        
    except ValueError as ve:
        return jsonify({
            'success': False,
            'error': f'Validation error: {str(ve)}'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/tours', methods=['GET'])
def get_tours():
    """Get all tours with basic info"""
    try:
        tours = Tour.query.all()
        tours_list = []
        
        for tour in tours:
            # Extract basic info from original_content
            original = tour.original_content
            tours_list.append({
                'id': tour.id,
                'name': original.get('name', ''),
                'description': original.get('description', ''),
                'duration': original.get('duration', ''),
                'created_at': tour.created_at.isoformat(),
                'updated_at': tour.updated_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'tours': tours_list
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/tours/<int:tour_id>', methods=['GET'])
def get_tour(tour_id):
    """Get tour details with optional adaptive content"""
    try:
        disability_type = request.args.get('disability_type')
        
        tour = Tour.query.get_or_404(tour_id)
        
        # Determine which content to return
        if disability_type and disability_type in [dt.value for dt in DisabilityType]:
            content_field = f'{disability_type}_content'
            content = getattr(tour, content_field)
            if not content:
                content = tour.original_content
            content_type = f'adaptive_{disability_type}'
        else:
            content = tour.original_content
            content_type = 'original'
        
        # Validate content structure
        try:
            validated_content = TourContentModel(**content)
            content_dict = validated_content.dict()
        except:
            content_dict = content
        
        response_data = {
            'success': True,
            'tour': {
                'id': tour.id,
                'content_type': content_type,
                'created_at': tour.created_at.isoformat(),
                'updated_at': tour.updated_at.isoformat(),
                **content_dict
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Care Service Management APIs
@app.route('/api/care-services', methods=['POST'])
def create_care_service():
    """Create a new care service with adaptive content using Pydantic validation"""
    try:
        data = request.json
        
        # Validate input using Pydantic model
        service_content = validate_and_create_care_service_content(data)
        
        # Generate adaptive content for all disability types
        adaptive_content = ContentAdaptationService.generate_all_adaptive_content(
            service_content, CareServiceContentModel
        )
        
        # Create care service record
        service = CareService(
            original_content=service_content.model_dump(),
            **adaptive_content
        )
        
        db.session.add(service)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Care service created successfully',
            'service_id': service.id,
            'content_structure': 'CareServiceContentModel'
        }), 201
        
    except ValueError as ve:
        return jsonify({
            'success': False,
            'error': f'Validation error: {str(ve)}'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/care-services', methods=['GET'])
def get_care_services():
    """Get all care services with basic info"""
    try:
        services = CareService.query.all()
        services_list = []
        
        for service in services:
            # Extract basic info from original_content
            original = service.original_content
            services_list.append({
                'id': service.id,
                'name': original.get('name', ''),
                'description': original.get('description', ''),
                'created_at': service.created_at.isoformat(),
                'updated_at': service.updated_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'care_services': services_list
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/care-services/<int:service_id>', methods=['GET'])
def get_care_service(service_id):
    """Get care service details with optional adaptive content"""
    try:
        disability_type = request.args.get('disability_type')
        
        service = CareService.query.get_or_404(service_id)
        
        # Determine which content to return
        if disability_type and disability_type in [dt.value for dt in DisabilityType]:
            content_field = f'{disability_type}_content'
            content = getattr(service, content_field)
            if not content:
                content = service.original_content
            content_type = f'adaptive_{disability_type}'
        else:
            content = service.original_content
            content_type = 'original'
        
        # Validate content structure
        try:
            validated_content = CareServiceContentModel(**content)
            content_dict = validated_content.dict()
        except:
            content_dict = content
        
        response_data = {
            'success': True,
            'service': {
                'id': service.id,
                'content_type': content_type,
                'created_at': service.created_at.isoformat(),
                'updated_at': service.updated_at.isoformat(),
                **content_dict
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Content Model APIs
@app.route('/api/content-models', methods=['GET'])
def get_content_models():
    """Get available content models and their schemas"""
    return jsonify({
        'success': True,
        'content_models': {
            'hotel': {
                'model': 'HotelContentModel',
                'schema': HotelContentModel.schema()
            },
            'tour': {
                'model': 'TourContentModel', 
                'schema': TourContentModel.schema()
            },
            'care_service': {
                'model': 'CareServiceContentModel',
                'schema': CareServiceContentModel.schema()
            }
        }
    })

# Utility APIs
@app.route('/api/disability-types', methods=['GET'])
def get_disability_types():
    """Get available disability types"""
    return jsonify({
        'success': True,
        'disability_types': [dt.value for dt in DisabilityType],
        'descriptions': {
            DisabilityType.WHEELCHAIR_USER.value: "Content adapted for wheelchair users with focus on mobility accessibility",
            DisabilityType.DYSLEXIA.value: "Content simplified for people with dyslexia using clear language",
            DisabilityType.COGNITIVE_IMPAIRMENT.value: "Content simplified for cognitive accessibility",
            DisabilityType.ANXIETY_TRAVEL_FEAR.value: "Content adapted to reduce travel anxiety with detailed information",
            DisabilityType.LOW_VISION.value: "Content enhanced with descriptive details for low vision users"
        }
    })

@app.route('/api/regenerate-content/<string:content_type>/<int:content_id>', methods=['POST'])
def regenerate_adaptive_content(content_type, content_id):
    """Regenerate adaptive content for specific disability type"""
    try:
        data = request.json
        disability_type = data.get('disability_type')
        
        if not disability_type or disability_type not in [dt.value for dt in DisabilityType]:
            return jsonify({
                'success': False,
                'error': 'Invalid or missing disability_type'
            }), 400
        
        # Get the appropriate model and content class
        if content_type == 'hotel':
            model = Hotel
            content_model_class = HotelContentModel
        elif content_type == 'tour':
            model = Tour
            content_model_class = TourContentModel
        elif content_type == 'care-service':
            model = CareService
            content_model_class = CareServiceContentModel
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid content type'
            }), 400
        
        # Get the record
        record = model.query.get_or_404(content_id)
        
        # Create content model from original content
        original_content_model = content_model_class(**record.original_content)
        
        # Generate new adaptive content
        disability_enum = DisabilityType(disability_type)
        new_content = ContentAdaptationService.adapt_content_for_disability(
            original_content_model, disability_enum, content_model_class
        )
        
        # Update the record
        content_field = f'{disability_type}_content'
        setattr(record, content_field, new_content)
        record.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Adaptive content regenerated for {disability_type}',
            'content': new_content,
            'content_structure': content_model_class.__name__
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Content validation endpoint
@app.route('/api/validate-content/<string:content_type>', methods=['POST'])
def validate_content(content_type):
    """Validate content against Pydantic models"""
    try:
        data = request.json
        
        if content_type == 'hotel':
            content_model = validate_and_create_hotel_content(data)
        elif content_type == 'tour':
            content_model = validate_and_create_tour_content(data)
        elif content_type == 'care-service':
            content_model = validate_and_create_care_service_content(data)
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid content type'
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Content validation successful',
            'validated_content': content_model.dict(),
            'model_used': content_model.__class__.__name__
        })
        
    except ValueError as ve:
        return jsonify({
            'success': False,
            'error': f'Validation error: {str(ve)}'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ------------------------
# DB init CLI (simple)
# ------------------------
@app.cli.command("init-db")
def init_db():  # pragma: no cover
    """Initialize database with correct schema"""
    print("🔄 Initializing database with correct schema...")
    
    # Drop all existing tables
    db.drop_all()
    print("🗑️  Dropped existing tables")
    
    # Create all tables with new schema
    db.create_all()
    print("✅ Database initialized with new schema")
    
    # Verify table structure
    try:
        inspector = db.inspect(db.engine)
        for table_name in ['hotels', 'tours', 'care_services']:
            columns = [col['name'] for col in inspector.get_columns(table_name)]
            print(f"📋 {table_name} columns: {columns}")
            
            # Verify required columns exist
            required_columns = [
                'id', 'created_at', 'updated_at', 'original_content',
                'wheelchair_user_content', 'dyslexia_content', 
                'cognitive_impairment_content', 'anxiety_travel_fear_content', 
                'low_vision_content'
            ]
            
            missing_columns = [col for col in required_columns if col not in columns]
            if missing_columns:
                print(f"❌ Missing columns in {table_name}: {missing_columns}")
            else:
                print(f"✅ {table_name} schema is correct")
                
    except Exception as e:
        print(f"⚠️  Schema verification failed: {e}")
    
    print("🎉 Database initialization complete!")

if __name__ == '__main__':
    with app.app_context():
        # Force reset database to ensure correct schema
        print("🔄 Initializing database with correct schema...")
        
        # Drop all existing tables
        db.drop_all()
        print("🗑️  Dropped existing tables")
        
        # Create all tables with new schema
        db.create_all()
        print("✅ Database initialized with new schema")
        
        # Verify table structure
        try:
            inspector = db.inspect(db.engine)
            for table_name in ['hotels', 'tours', 'care_services']:
                columns = [col['name'] for col in inspector.get_columns(table_name)]
                print(f"📋 {table_name} columns: {columns}")
                
                # Verify required columns exist
                required_columns = [
                    'id', 'created_at', 'updated_at', 'original_content',
                    'wheelchair_user_content', 'dyslexia_content', 
                    'cognitive_impairment_content', 'anxiety_travel_fear_content', 
                    'low_vision_content'
                ]
                
                missing_columns = [col for col in required_columns if col not in columns]
                if missing_columns:
                    print(f"❌ Missing columns in {table_name}: {missing_columns}")
                else:
                    print(f"✅ {table_name} schema is correct")
                    
        except Exception as e:
            print(f"⚠️  Schema verification failed: {e}")
    
    print("🚀 Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)

# flask --app cms_backend_v2.py init-db && python cms_backend_v2.py