-- Notification Templates Table
-- Run this in your Supabase SQL editor to set up the notification system

CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage text NOT NULL UNIQUE CHECK (stage IN ('screening', 'interview', 'placed', 'rejected', 'offer')),
  subject text NOT NULL,
  body text NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Notifications Log Table (audit trail)
CREATE TABLE IF NOT EXISTS notifications_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  stage text NOT NULL,
  sent_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'sent',
  template_used text,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies for notification_templates (admin only)
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read notification templates" ON notification_templates
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can update notification templates" ON notification_templates
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- RLS Policies for notifications_log (admins can read, system can write)
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read notifications log" ON notifications_log
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can insert notification logs" ON notifications_log
  FOR INSERT
  WITH CHECK (true);

-- Seed default templates
INSERT INTO notification_templates (stage, subject, body) VALUES
  ('screening', 
   '{{candidate_name}} - Next Step in Your Application',
   'Hi {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position. We''re impressed by your application and would like to move forward with the screening process.\n\nWe''ll be in touch shortly with next steps.\n\nBest regards,\nThe ASODS Team'),
  
  ('interview',
   '{{candidate_name}} - Interview Invitation for {{job_title}}',
   'Hi {{candidate_name}},\n\nWe''re pleased to invite you to an interview for the {{job_title}} position. We''d love to learn more about you and discuss how you can contribute to our team.\n\nOur team will contact you with available times for the interview.\n\nBest regards,\nThe ASODS Team'),
  
  ('offer',
   'Job Offer - {{job_title}} Position',
   'Hi {{candidate_name}},\n\nWe''re excited to offer you the {{job_title}} position.\n\nOffer Details:\n- Position: {{job_title}}\n- Compensation: {{salary}}\n- Start Date: {{start_date}}\n\n{{custom_note}}\n\nWe look forward to working with you!\n\nBest regards,\nThe ASODS Team'),
  
  ('placed',
   '{{candidate_name}} - Welcome to Your New Role',
   'Hi {{candidate_name}},\n\nCongratulations! You have been placed in the {{job_title}} position. This is an exciting opportunity and we''re confident you''ll make a great impact.\n\nYour journey with us begins now. If you have any questions, don''t hesitate to reach out.\n\nWelcome aboard!\n\nBest regards,\nThe ASODS Team'),
  
  ('rejected',
   '{{candidate_name}} - Application Update',
   'Hi {{candidate_name}},\n\nThank you for your interest in the {{job_title}} position and for taking the time to apply. After careful consideration, we''ve decided to move forward with other candidates whose experience more closely aligns with our needs at this time.\n\nWe appreciate your effort and wish you the best in your career.\n\nBest regards,\nThe ASODS Team')
ON CONFLICT (stage) DO NOTHING;
