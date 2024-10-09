'use client';

import { usePathname } from 'next/navigation';
import RegisterEmployer from './registerEmployer';
import RegisterCandidate from './registerCandidate';

const Register = () => {
    const pathname = usePathname();

    return <>{pathname?.includes('/register/employer') ? <RegisterEmployer /> : <RegisterCandidate />}</>;
};

export default Register;