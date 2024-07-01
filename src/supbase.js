import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ngdoxltaosidmheehubi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZG94bHRhb3NpZG1oZWVodWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5NDQzMjMsImV4cCI6MjAzMjUyMDMyM30.0iTu60ObLaSuKr0maRoB7jGlhETugxH1vaHxeNsOzi4";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
