import React, {useState,useEffect} from 'react'
import {View , Text, Image, StyleSheet} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import IonIcon from 'react-native-vector-icons/Ionicons';

import { Firestore, getDoc, collection, getDocs,
  addDoc, deleteDoc, doc,
  query, where, onSnapshot, Document, whereEqualTo

} from 'firebase/firestore';
import {db} from '../../firebase';
import { auth } from '../../firebase';
import { storage } from '../../firebase';
import { ref, getDownloadURL } from "firebase/storage";

import colors from '../config/colors';


const Friend = (props) => {
  const [username, setusername] = useState("");
  const [swim,setswim] =useState(false);
  const [run, setrun] = useState(false);
  const [cycle, setcycle] = useState(false);
  const [done, setdone] = useState(false);
  const [downloadURL, setdownloadURL] = useState('');
  const [arr, setArr] = useState([])

  useEffect(async () => {
    const friendsDocRef = doc(db, "user_status", props.username);
    const friendsDocSnap = await getDoc(friendsDocRef);
    const userData = friendsDocSnap.data();
    setusername(userData["username"])
    setswim(userData["Swim"])
    setrun(userData["Run"])
    setcycle(userData["Cycle"])
    const pathReference = ref(storage, 
      '/user_profile_pictures/' + props.username + '/' + props.username);
    setdownloadURL(await getDownloadURL(pathReference));
    console.log(downloadURL)

    const docRef = doc(db, "user_status", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setArr(docSnap.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }

    setdone(true)
  }, [])
  return (
    <View>
    {done  ?<View style = {{borderRadius:12, backgroundColor: '#ffffff', marginVertical:8, padding: 16, elevation: 1}}>
    <View style ={{flexDirection: "row", justifyContent:"flex-start", alignItems: "flex-start"}}>
        <Image source = {{uri: String(downloadURL)}}
         style = {{width: 80, height: 80, borderRadius: 8}} />
         <View style ={{marginLeft: 220, marginTop: 15}}> 
         <MaterialCommunityIcons name= 'chat' 
                    color= "black" 
                    size={40}
                    onPress={props.chat} />
         </View>
    </View>

    <View style = {{marginTop:12, flexDirection: "row", justifyContent: "space-between"}}>
        <View>
        <Text style ={{fontWeight: "bold", fontSize: 25, color: colors.primary }}>{username}</Text>
        <Text style = {{fontWeight: "bold", paddingTop: 5, color: colors.secondary}}>Status: {arr.status}</Text>
        <View style = {{marginTop:12, flexDirection: "row", justifyContent: "space-between"}}>
        <Text style ={{fontWeight: "bold"}}>Interests: </Text>
        { swim && <MaterialCommunityIcons name= 'swim' 
                    color= "black" 
                    size={20} /> }
        { run && <MaterialCommunityIcons name= 'run' 
                    color= "black" 
                    size={20} />}
        { cycle && <IonIcon name="bicycle" 
                 size={20} 
                 color="black" /> }
                  
        </View>
        </View>

        <MaterialCommunityIcons name= 'account-remove' 
                    color= "black" 
                    size={40}
                    onPress = {
                        props.removeAccount
                    } />
        
    </View>

    </View> : null}
    </View>
  )
}

export default Friend