{...}: {
  services.postgres = {
    enable = true;
    port = 5432;
    listen_addresses = "localhost";
    initialDatabases = [
      {
        name = "members";
        user = "user";
        pass = "pass";
        schema = ./members.sql;
      }
    ];
  };
}
