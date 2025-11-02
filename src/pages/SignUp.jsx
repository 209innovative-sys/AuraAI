import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function SignUp() {
  const emailPass = () => {
    const email = prompt('Email?');
    const pass = prompt('Password?');
    createUserWithEmailAndPassword(auth, email, pass);
  };
  return (
    <div className='p-8 text-center'>
      <h1 className='text-3xl text-aura mb-6'>Create Account</h1>
      <button onClick={emailPass} className='bg-purple-700 p-3 rounded'>Email Sign Up</button>
      <button onClick={() => signInWithPopup(auth, provider)} className='bg-white text-black p-3 ml-4 rounded'>Google</button>
    </div>
  );
}
