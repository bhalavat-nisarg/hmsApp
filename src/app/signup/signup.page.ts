import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  name: '';
  email: '';
  password: '';
  uid: any;
  saveUser = {
    uid: '',
    name: '',
    email: ''
  };

  constructor(
    public navCtrl: NavController,
    public toastctrl: ToastController,
    public alertctrl: AlertController,
    public storage: Storage) { }

signup() {
  // console.log(this.name, this.email, this.password);
  firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
    (data) => {
      console.log(data);
      const newUser: firebase.User = data.user;
      newUser.updateProfile({
        displayName: this.name,
        photoURL: ''
      }).then(async () => {
        console.log('Profile Updated');
        this.uid = firebase.auth().currentUser.uid.toString();
        this.saveUser.name = this.name;
        this.saveUser.email = this.email;
        this.saveUser.uid = this.uid;
        // console.log(this.saveUser);
        this.register();
        const alert = await this.alertctrl.create({
          header: 'Success!!',
          message: 'Your Account has been created successfully',
          buttons: [
            {
              text: 'ok',
              role: 'submit',
              handler: () => {
                console.log('Login function displayed..');
                this.storage.set('username', this.name);
                // navigate to feeds page
                this.navCtrl.navigateRoot('/home1');
              }
            }
          ]
        });
        await alert.present();
      }).catch(async (err) => {
        console.log(err);
        (await this.toastctrl.create({
          message: err.message, duration: 3000
        })).present();
        // await errAlert.present();
      });

    }).catch(async (err) => {
      console.log(err);
      (await this.toastctrl.create({
        message: err.message, duration: 3000
      })).present();
    });
}

  ngOnInit() {
  }
  gotologin() {
  this.navCtrl.navigateBack('/login');
 }
 ionViewWillEnter() {
   this.storage.remove('username');
 }

 register() {
   firebase.firestore().collection('users').doc(this.saveUser.uid).set({
     uid: this.saveUser.uid,
     name: this.saveUser.name,
     email: this.saveUser.email,
     phone: '',
     flat: '',
     building: '',
     area: '',
     city: '',
     state: '',
     pincode: '',
     wallet: 0
   }).then(() => {
     console.log('User created in Firestore..');
     this.storage.set('currentUser', {
      username: this.saveUser.name,
      userId: this.saveUser.uid,
      email: this.saveUser.email,
    });
   })
   .catch((error) => {
     console.log(error);
   });
 }
}
