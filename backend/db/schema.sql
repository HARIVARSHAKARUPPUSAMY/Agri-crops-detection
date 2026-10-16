-- PostgreSQL Database Schema for AI-Based Universal Fruit and Vegetable Quality Grading System

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Organisation', 'Individual Person')),
    organization_name VARCHAR(255),
    department VARCHAR(100),
    contact_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    speed VARCHAR(20) DEFAULT 'balanced' CHECK (speed IN ('fast', 'balanced', 'detailed')),
    model VARCHAR(20) DEFAULT 'premium' CHECK (model IN ('premium', 'general')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Grading Records Table
CREATE TABLE IF NOT EXISTS grading_records (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    produce_name VARCHAR(100) NOT NULL,
    crop_category VARCHAR(50) NOT NULL CHECK (crop_category IN ('Fruit', 'Vegetable')),
    detected_item_count INTEGER NOT NULL DEFAULT 1,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    final_grade VARCHAR(20) NOT NULL CHECK (final_grade IN ('Grade A', 'Grade B', 'Grade C', 'Rejected')),
    quality_class VARCHAR(100) NOT NULL,
    produce_confidence NUMERIC(5, 4) NOT NULL,
    defect_confidence NUMERIC(5, 4) NOT NULL,
    quality_confidence NUMERIC(5, 4) NOT NULL,
    overall_confidence NUMERIC(5, 4) NOT NULL,
    overall_defect_area_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    grading_rules_applied TEXT NOT NULL,
    human_review_required BOOLEAN NOT NULL DEFAULT FALSE,
    review_reasons JSONB DEFAULT '[]'::jsonb,
    speed_mode_used VARCHAR(20) NOT NULL,
    model_mode_used VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Detected Defects Table
CREATE TABLE IF NOT EXISTS detected_defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grading_record_id VARCHAR(50) NOT NULL REFERENCES grading_records(id) ON DELETE CASCADE,
    defect_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Minor', 'Moderate', 'Severe')),
    affected_area_percent NUMERIC(5, 2) NOT NULL,
    confidence NUMERIC(5, 4) NOT NULL,
    bounding_box JSONB NOT NULL,
    polygon JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Support Inquiries Table
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_grading_records_user_id ON grading_records(user_id);
CREATE INDEX IF NOT EXISTS idx_grading_records_created_at ON grading_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_grading_records_final_grade ON grading_records(final_grade);
CREATE INDEX IF NOT EXISTS idx_detected_defects_grading_record_id ON detected_defects(grading_record_id);
