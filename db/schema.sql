CREATE TABLE IF NOT EXISTS sankalps_v2 (
  day DATE NOT NULL,
  token UUID NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('kindness', 'seva', 'bonds', 'community', 'values', 'purpose')),
  PRIMARY KEY (day, token)
);
