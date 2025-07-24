const errorMessageMap: Record<string, string> = {
  'Peer not found': "L'émetteur n'a pas été trouvé. Veuillez réessayer.",
  'Connection failed': "La connexion à l'émetteur a échoué. Vérifiez qu'il est allumé et à portée.",
  'Connection timeout': "La connexion a expiré. L'émetteur n'a pas répondu à temps.",
  'Permission denied': "Vous n'avez pas la permission requise pour vous connecter à cet émetteur.",
  'Bluetooth is disabled': "Le Bluetooth est désactivé. Veuillez l'activer pour continuer.",
  'Peer is already connected': "Cet émetteur est déjà connecté à un autre appareil.",
  'Peer is not connectable': "Cet émetteur n'accepte pas de connexion actuellement.",
  'Authentication failed': "Le code PIN est incorrect ou l'authentification a échoué.",
  'Security PIN required': "Un code PIN est requis pour se connecter à cet émetteur.",
  'Scan is in progress': "Un scan est déjà en cours. Veuillez patienter.",
  'Device is in airplane mode': "L'appareil est en mode avion. Désactivez-le pour continuer.",
  'Insufficient system resources': "Ressources système insuffisantes pour établir la connexion.",
  'LoRa frequency not allowed in this region': "La fréquence LoRa utilisée n'est pas autorisée dans cette région.",
  'LoRa transmission power exceeded': "La puissance de transmission LoRa dépasse la limite autorisée.",
  'LoRa interference detected': "Interférences détectées sur la fréquence LoRa. Réessayez plus tard.",
};

export default errorMessageMap; 