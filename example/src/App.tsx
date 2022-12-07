import * as React from 'react';
import * as jose from 'jose';
import { StyleSheet, View, Text, Button } from 'react-native';
import { multiply } from 'react-native-local-testing';
import { KeyPair, RSA } from 'react-native-rsa-native';
//import { sign } from "react-native-pure-jwt";
import forge from 'node-forge';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();


function encodeB64(str:string) {
    const encodedB64 = forge.util.encode64(str);
    return (encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
}


  async function newjwt() {
    var privatekey = (await (Promise.resolve(RSA.generateKeys(4096)))).private;
    console.log('key =  '+ privatekey)
    const key = forge.pki.privateKeyFromPem(privatekey);
    const md = forge.md.sha256.create();
    const header = {
        alg: "RS256",
        typ: "JWT"
    };
    const strHeader = JSON.stringify(header);
    const strPayload = JSON.stringify({
      "key":"value"
    });
    const header64 = encodeB64(strHeader);
    const payload64 = encodeB64(strPayload);
    const preHash = header64 + '.' + payload64;
    md.update(preHash, 'utf8');
    const signature = key.sign(md);
    const signature64 = encodeB64(signature);
    console.log(header64 + '.' + payload64 + '.' + signature64);
  }

  // async function jwt() {
  //   var key = (await (Promise.resolve(RSA.generateKeys(4096)))).private;
  //   console.log('key =  '+key)
  //   sign(
  //     {
  //       iss: "mosip",
  //       exp: new Date().getTime() + 3600 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
  //       additional: "payload"
  //     }, // body
  //     key, // secret
  //     {
  //       alg: "HS256"
  //     }
  //   )
  //     .then(console.log) // token as the only argument
  //     .catch(console.error);
  // }

  async function joseLib() {
    var encoder = new TextEncoder();
    let publicKey:string = '-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAwrqqfo8+BJblMAUzEkDL1CUudCaDwttzdS2G0sTMZUuW8tTtdW/l\nH3OtyXNB49U9PBy3GJgTK1eZgyKvKSN04P3QumJF6ISGktLFYCGkD8H62zuVyIvC\nCXxnt64qaovrGE/ERVBCqS9nTRlwsFByKkExEmTj9gKo5UX2SG8+dMxSwD1pIh0U\nsjKOXqo+5Cc5mqWqQAI4xqlhJxIs+wmu6bq1+k7F53FOFk3ds7sMzmUL7j18Be9M\nd58Kfyv7xyoHoxcl50oEzTxC9qxXzy/uznFuX6S0PmlFZ2k19BeBZ9LdRRv7EM6s\ndMm6S2EJDkaluHss8asiCa9xX9FVGOfjvcp/zBNXDDPwwgst4Bv5t0azVu0IwY6f\nMbhPEbeOtXF71yAVMF32VzwABhSjxc6J1qEQt3kpK96HD7jdDusdnhEBVS1P5jQu\nl+9qkZTPcGdEVD4jcy/AzhvJkNEYT0Jouu1VpPtRG2zNWMzFQmsX+lYyyimI7efY\n4kbjCds7H6Xh0jXaPjCDQTToVsJDRi3Cq0gnYQ8Q5BWnZ0YjmrFpi3KbJzT2l7IW\n6myAU0gmLbH4hMBtm+WSI/IpqYi09tN+et1YzFnNzQBCXmw/4emNx0Iq0lPd4RVx\nNne3xIixKeNZHsuQ6TLsgxMF7SFzrtXg0eFTLlQDET7pMLfFKi021G8CAwEAAQ==\n-----END RSA PUBLIC KEY-----\n';
    const jwe = await new jose.CompactEncrypt(
      encoder.encode('It’s a dangerous business, Frodo, going out your door.'),
    )
      .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
      .encrypt({type:publicKey})
    
    console.log(jwe)
    
  }

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button title='click me' onPress={newjwt}>Click me</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
