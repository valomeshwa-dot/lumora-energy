import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase.from('leads').insert([{
        full_name: "Test",
        phone: "123",
        email: "test@test.com",
        city: "Mumbai",
        monthly_bill: 5000,
        roof_type: "Flat",
        property_type: "Residential",
        message: "Test message",
    }]);
    console.log("Insert Response:", data);
    console.log("Insert Error:", error);
}

test();
