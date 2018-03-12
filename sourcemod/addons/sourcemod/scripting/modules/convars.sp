void Hawthorne_InitConVars() {
  MANAGER           = CreateConVar("ht_MANAGER",
                                   "http://127.0.0.1:80/",
                                   "management server address including port and protocol",
                                   FCVAR_NONE);

  APITOKEN         = CreateConVar("ht_MANAGER_token",
                                   "",
                                   "management server provided token (required)",
                                   FCVAR_PROTECTED);

  MODULE_BAN      = CreateConVar("ht_ban",
                                   "1",
                                   "Toggle the internal ban module",
                                   FCVAR_NONE,
                                   true, 0.0,
                                   true, 1.0);

  MODULE_ADMIN    = CreateConVar("ht_admin",
                                   "1",
                                   "Toggle the internal admin module",
                                   FCVAR_NONE,
                                   true, 0.0,
                                   true, 1.0);
  MODULE_MUTEGAG  = CreateConVar("ht_mutegag",
                                   "1",
                                   "Toggle the internal mute and gag module",
                                   FCVAR_NONE,
                                   true, 0.0,
                                   true, 1.0);

  MODULE_LOG      = CreateConVar("ht_log",
                                   "1",
                                   "Toggle the internal chatlog module",
                                   FCVAR_NONE,
                                   true, 0.0,
                                   true, 1.0);

  MODULE_MUTEGAG_GLOBAL   = CreateConVar("ht_global_mutegag",
                                   "0",
                                   "Toggle of serverwide mute & gags",
                                   FCVAR_NONE,
                                   true, 0.0,
                                   true, 1.0);

  MODULE_BAN_GLOBAL       = CreateConVar("ht_global_ban",
                                   "0",
                                   "Toggle of serverwide bans",
                                   FCVAR_NONE,
                                   true, 0.0,
                                   true, 1.0);

  AutoExecConfig(true, "hawthorne");
}
