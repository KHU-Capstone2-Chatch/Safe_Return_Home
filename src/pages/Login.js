import React, {useState} from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {Box, Button, styled, TextField} from "@mui/material";
import { getDoc, doc } from "firebase/firestore";
import '../styles/main.css';

function Login({db, openAlert}) {
    const navigate = useNavigate();

    const [id, setId] = useState('r@gmail.com');
    const [password, setPassword] = useState('123456');

    const signIn = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, id + '@gmail.com', password)
            .then(async (userCredential) => {
                // Signed in
                console.log(userCredential.user)
                const user = await getUserData();
                goToHome(user);
            })
            .catch((error) => {
                console.error(error)
            });
    }

    const getUserData = async () => {
        const docRef = doc(db, "Users", id);
        const docSnap = await getDoc(docRef);
        let user;

        if (docSnap.exists()) {
            user = docSnap.data();
            goToHome(user);
        } else {
            console.log("No such document!");
        }
        return user
    }

    const goToSignUp = () => {
        navigate('/signUp');
    }

    const goToHome = (user) => {
        if (user?.type === 'safeUser') {
            navigate('/safeUser', {state: {user: user}});
        } else {
            navigate('/', {state: {user: user}});
        }
    }

    return (
        <Box className='container'>
            <img src='images/logo.png' alt='' style={{width: '200px'}} />
            <Box>
                <Box width='100%' height='50%' style={{paddingTop: 60}}>
                    <TextField id="id" type="text" label="아이디" variant="outlined" onChange={(e) => {setId(e.target.value)}} fullWidth style={styles.textBox} />
                    <TextField id="password" type="password" label="비밀번호" variant="outlined" onChange={(e) => {setPassword(e.target.value)}} fullWidth style={styles.textBox} />
                </Box>
                <Box width='100%' style={{paddingTop: 10}}>
                    <Button variant="contained" onClick={signIn} fullWidth style={styles.primaryButton} >로그인</Button>
                    <Button variant="contained" onClick={goToSignUp} style={styles.secondButton}  fullWidth >회원가입</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Login;

const styles = {
    textBox: {
        marginBottom: 20
    },
    primaryButton: {
        marginBottom: 20, backgroundColor: '#4270CC', color: '#fff'
    },
    secondButton: {
        marginBottom: 20, backgroundColor: '#49C7A1', color: '#000'
    }
}