const API_BASE_URL = 'http://localhost:5001/api';

export interface DisabilityType {
  WHEELCHAIR_USER: 'wheelchair_user';
  DYSLEXIA: 'dyslexia';
  COGNITIVE_IMPAIRMENT: 'cognitive_impairment';
  ANXIETY_TRAVEL_FEAR: 'anxiety_travel_fear';
  LOW_VISION: 'low_vision';
}

export interface HotelContent {
  name: string;
  location: string;
  coordinates?: string;
  prices: Record<string, string | number>;
  accessibility_features: Record<string, string>;
  images: string[];
  cancellation_conditions: string;
  meal_times: Record<string, string>;
  parking: string;
  amenities: Record<string, string>;
  nearby_accessible_places: Array<Record<string, string>>;
  accessibility_notes: string;
}

export interface TourContent {
  name: string;
  description: string;
  destinations: string[];
  activities: Array<Record<string, string>>;
  accessibility_features: Record<string, string>;
  photos: string[];
  duration: string;
  itinerary: Array<Record<string, string>>;
  support_services: string[];
}

export interface CareServiceContent {
  name: string;
  description: string;
  care_types: string[];
  staff_qualifications: string[];
  pricing_insurance: Record<string, string>;
  images: string[];
  emergency_contact: Record<string, string>;
  accessibility_features: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}

class CMSApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Hotel APIs
  async createHotel(hotelData: HotelContent): Promise<ApiResponse<{ hotel_id: number }>> {
    return this.request('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData),
    });
  }

  async getHotels(): Promise<ApiResponse<{ hotels: any[] }>> {
    return this.request('/hotels');
  }

  async getHotel(hotelId: number, disabilityType?: string): Promise<ApiResponse<{ hotel: any }>> {
    const params = disabilityType ? `?disability_type=${disabilityType}` : '';
    return this.request(`/hotels/${hotelId}${params}`);
  }

  // Tour APIs
  async createTour(tourData: TourContent): Promise<ApiResponse<{ tour_id: number }>> {
    return this.request('/tours', {
      method: 'POST',
      body: JSON.stringify(tourData),
    });
  }

  async getTour(tourId: number, disabilityType?: string): Promise<ApiResponse<{ tour: any }>> {
    const params = disabilityType ? `?disability_type=${disabilityType}` : '';
    return this.request(`/tours/${tourId}${params}`);
  }

  // Care Service APIs
  async createCareService(serviceData: CareServiceContent): Promise<ApiResponse<{ service_id: number }>> {
    return this.request('/care-services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async getCareService(serviceId: number, disabilityType?: string): Promise<ApiResponse<{ service: any }>> {
    const params = disabilityType ? `?disability_type=${disabilityType}` : '';
    return this.request(`/care-services/${serviceId}${params}`);
  }

  // Utility APIs
  async getDisabilityTypes(): Promise<ApiResponse<{ disability_types: string[]; descriptions: Record<string, string> }>> {
    return this.request('/disability-types');
  }

  async getContentModels(): Promise<ApiResponse<{ content_models: any }>> {
    return this.request('/content-models');
  }

  async validateContent(contentType: string, data: any): Promise<ApiResponse<{ validated_content: any }>> {
    return this.request(`/validate-content/${contentType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async regenerateAdaptiveContent(
    contentType: string, 
    contentId: number, 
    disabilityType: string
  ): Promise<ApiResponse<{ content: any }>> {
    return this.request(`/regenerate-content/${contentType}/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ disability_type: disabilityType }),
    });
  }
}

// Enhanced AI prompts addressing specific accessibility pain points
export const ENHANCED_ADAPTATION_PROMPTS = {
  wheelchair: `
    CRITICAL: Address wheelchair accessibility pain points by:
    1. PRIORITIZE and prominently display: ramps, elevators, door widths (minimum 32"), accessible bathrooms with grab bars
    2. Add specific measurements and accessibility certifications
    3. Include accessible parking details and drop-off zones
    4. Emphasize barrier-free paths and accessible entrances
    5. Show accessible room features prominently
    6. Replace generic images with accessibility-focused descriptions
    Return JSON with accessibility features moved to the top of every section.
  `,
  
  dyslexia: `
    CRITICAL: Address dyslexia reading challenges by:
    1. Break ALL long paragraphs into 1-2 sentence chunks
    2. Replace complex words with simple alternatives (e.g., "accommodate" → "help", "utilize" → "use")
    3. Add explanations for ANY technical terms in parentheses
    4. Use bullet points and numbered lists instead of dense text
    5. Add visual structure with clear headings for each section
    6. Use consistent, simple language throughout
    Return JSON with simplified, structured text that's easy to scan.
  `,
  
  cognitive: `
    CRITICAL: Address cognitive overload by:
    1. Simplify ALL instructions to single, clear actions
    2. Break complex information into numbered steps
    3. Use concrete, specific details instead of abstract concepts
    4. Highlight essential information first, details second
    5. Add clear "What to do next" sections
    6. Emphasize support contact prominently at the top
    Return JSON with simplified, step-by-step structure.
  `,
  
  anxiety: `
    CRITICAL: Address travel anxiety by:
    1. PROMINENTLY display cancellation policies and flexibility options at the top
    2. Add detailed safety measures and 24/7 support contact
    3. Use reassuring, calm language ("You're supported", "We're here to help")
    4. Provide predictable, detailed information to reduce uncertainty
    5. Highlight staff availability and assistance options
    6. Add "Quick Help" sections for immediate support
    Return JSON with supportive tone and safety information prioritized.
  `,
  
  'low-vision': `
    CRITICAL: Address low vision accessibility by:
    1. Add detailed verbal descriptions of ALL visual elements
    2. Describe layout, colors, and spatial relationships in text
    3. Provide detailed alt text descriptions for every image reference
    4. Emphasize high-contrast features and good lighting
    5. Highlight braille availability and audio assistance
    6. Structure content with clear headings for screen readers
    Return JSON with enhanced descriptive content for screen readers.
  `
};

export const cmsApi = new CMSApiService();