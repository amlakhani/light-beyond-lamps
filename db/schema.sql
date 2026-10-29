CREATE TABLE IF NOT EXISTS sankalps (
  day DATE NOT NULL,
  token UUID NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('forgive', 'serve', 'family', 'kind', 'volunteer', 'gratitude')),
  PRIMARY KEY (day, token)
);
