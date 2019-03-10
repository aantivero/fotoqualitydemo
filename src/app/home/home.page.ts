import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component } from '@angular/core';
import { AlertController, Platform} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path/ngx';

declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public photos: any;
  public base64Image: string;
  public quality: number;
  public height: number;
  public width: number;

  constructor(private camera: Camera,
    private alertController: AlertController,
    //private transfer: Transfer, 
    private file: File, 
    //private filePath: FilePath,
    public platform: Platform) {
      this.photos = [];
  }

  takePhoto() {
    console.log("TakePhoto " + this.quality +  "-" + this.height +"-" +this.width);

    const options: CameraOptions = {
      quality: this.quality,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: this.width,
      targetHeight: this.height,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      allowEdit: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
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

  // Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      //this.lastImage = newFileName;
      console.log("Alamacenada la imagen");
    }, error => {
      console.error('Error al guardar el archivo');
  });
}

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}
