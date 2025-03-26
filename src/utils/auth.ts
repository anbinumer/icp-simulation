export const verifyForCertificate = (playerName: string, score: number): {valid: boolean, message?: string} => {
    if (!playerName || playerName.trim().length < 2) {
      return {
        valid: false,
        message: "Please enter your full name to generate a certificate"
      };
    }
    
    if (score < 200) {
      return {
        valid: false,
        message: "You must achieve a minimum score of 200 to earn a certificate"
      };
    }
    
    return { valid: true };
  };