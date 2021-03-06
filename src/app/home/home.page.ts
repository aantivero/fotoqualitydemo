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
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: this.width,
      targetHeight: this.height,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      allowEdit: false
    };

    this.camera.getPicture(options).then((imageData) => {  
      //here converting a normal image data to base64 image data.  
      let base64ImageData = 'data:image/jpeg;base64,' + imageData;  
      /**here passing three arguments to method 
      *Base64 Data 

      *Folder Name 

      *File Name 
      */  
      this.writeFile(base64ImageData, 'Cheques', 'cheque01.jpeg');  
    }, (error) => {  
      console.log('Ocurrio un error ' + error);       
      });   
    /*this.camera.getPicture(options).then(
      (imageData) => {
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
    );*/
  }
  //here is the method is used to write a file in storage  
  public writeFile(base64Data: any, folderName: string, fileName: any) {  
    let contentType = this.getContentType(base64Data);  
    let DataBlob = this.base64toBlob(base64Data, contentType);  
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    let filePath = this.file.externalRootDirectory + folderName;  
    this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {  
        console.log("File Writed Successfully", success);  
    }).catch((err) => {  
        console.log("Error Occured While Writing File", err);  
    })  
}  
//here is the method is used to get content type of an bas64 data  
public getContentType(base64Data: any) {  
    let block = base64Data.split(";");  
    let contentType = block[0].split(":")[1];  
    return contentType;  
}  
//here is the method is used to convert base64 data to blob data  
public base64toBlob(b64Data, contentType) {  
    contentType = contentType || '';  
    let sliceSize = 512;  
    let byteCharacters = atob(b64Data);  
    let byteArrays = [];  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {  
        let slice = byteCharacters.slice(offset, offset + sliceSize);  
        let byteNumbers = new Array(slice.length);  
        for (let i = 0; i < slice.length; i++) {  
            byteNumbers[i] = slice.charCodeAt(i);  
        }  
        var byteArray = new Uint8Array(byteNumbers);  
        byteArrays.push(byteArray);  
    }  
    let blob = new Blob(byteArrays, {  
        type: contentType  
    });  
    return blob;  
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
