-- Create partners table for managing partnership companies
CREATE TABLE public.partners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create locations table for managing event venues
CREATE TABLE public.locations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    capacity INTEGER,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies for partners
CREATE POLICY "Authenticated users can view partners" 
ON public.partners 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create partners" 
ON public.partners 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update partners" 
ON public.partners 
FOR UPDATE 
USING (true);

-- Create policies for locations
CREATE POLICY "Authenticated users can view locations" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create locations" 
ON public.locations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update locations" 
ON public.locations 
FOR UPDATE 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();