import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public photos: any;
  public base64Image: string;
  public quality: number;

  constructor(private camera: Camera,
    private alertController: AlertController,) {
      this.photos = [];
  }

  takePhoto() {
    console.log("TakePhoto ");

    const options: CameraOptions = {
      quality: this.quality,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        //this.sendData(imageData);
      },
      err => {
        console.log(err);
      }
    );
  }

  async deletePhoto(index) {
    const alert = await this.alertController.create({
      header: 'Eliminar Foto!',
      message: 'Desea <strong>eliminar</strong> la foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelación:');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirmado Eliminar');
            this.photos.splice(index, 1);
          }
        }
      ]
    });

    await alert.present();
  }

}
