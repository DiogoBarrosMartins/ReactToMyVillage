import React, { useState } from 'react';
import { createNewAccount } from '../api/createNewAccount';
import { useNavigate } from 'react-router-dom';
import '../css/NewAccount.css';

import elfImage from '../images/elf.jpg';
import humanImage from '../images/human.jpg';
import orcImage from '../images/orc.jpg';

const tribeImages: Record<string, string> = {
humans: humanImage,
orcs: orcImage,
elves: elfImage
};
export function NewAccount() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
const [tribe, setTribe] = useState<string | undefined>(undefined);

const tribeDescriptions: Record<string, string> = {
    humans: "Humans: Balanced stats. Some say the strongest race. Known for their Knights and Archers.",
    orcs: "Orcs: High strength, low intelligence. Fear their Berserkers and Warlords.",
    elves: "Elves: High intelligence, low strength. Their Mages and Archers are legendary."
};

const navigate = useNavigate();

async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    if (tribe) {
        await createNewAccount({ username, password, email, tribe });
        navigate('/');
    }
}

return (
    <div className="new-account-page">
    <h1>Wow create an account, good choice buddy.</h1>
    <form onSubmit={createAccount}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <p>Choose your tribe:</p>
            <div className="tribe-selection">
                {['Humans', 'Orcs', 'Elves'].map(t => 
                    <div className="tribe-card" key={t}>
                        <input type="radio" id={`tribe-${t}`} name="tribe" checked={tribe === t.toLowerCase()} onChange={() => setTribe(t.toLowerCase())} />
                        <label htmlFor={`tribe-${t}`}>
                            <p>{t}</p>
                            <img src={tribeImages[t.toLowerCase()]} alt={`${t} tribe`} />
                            <p>{tribeDescriptions[t.toLowerCase()]}</p>
                        </label>
                    </div>
            )}
        </div>

        <div className="button-container">
            <button type="submit">Create Account</button>
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>

    </form>
    
</div>)

                }

export default NewAccount;
