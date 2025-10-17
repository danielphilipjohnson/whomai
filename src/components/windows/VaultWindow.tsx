import React from 'react';

const VaultWindow: React.FC = () => {
  return (
    <div className="w-full h-full bg-black text-white p-4 font-mono">
      <h1 className="text-2xl text-neon-green">ACCESS GRANTED</h1>
      <p className="mt-4">Welcome to the inner sanctum. Here are the secrets of the universe:</p>
      <ul className="mt-4 list-disc list-inside">
        <li>The meaning of life is 42.</li>
        <li>Cats are secretly plotting to take over the world.</li>
        <li>The best way to eat a pizza is with a knife and fork.</li>
      </ul>
    </div>
  );
};

export default VaultWindow;
