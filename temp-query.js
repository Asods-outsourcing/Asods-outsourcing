const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getJob() {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, title, job_summary, location, created_at")
      .limit(1);
    
    if (error) {
      console.error("Error:", error);
      process.exit(1);
    }
    
    if (data && data.length > 0) {
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log("No jobs found");
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

getJob();
