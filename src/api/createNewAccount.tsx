interface AccountDetails {
  username: string;
  password: string;
  email: string;
  tribe: string;
}

export async function createNewAccount(accountDetails: AccountDetails) {
  console.log("Creating new account with details: ", accountDetails);  // Log the account details

  // Set your API URL here
  const response = await fetch('http://localhost:8080/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountDetails),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
