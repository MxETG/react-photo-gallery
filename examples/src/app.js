import React from 'react';
import ReactDOM from 'react-dom';
import ImageSection from './ImageSection';
import SearchField from "react-search-field";
import ImageUploader from 'react-images-upload';
import axios from 'axios'

const backendUrl = "http://127.0.0.1:3000/";
const uploadUrl = "upload-image";
const getAllUrl = "all-images";
const searchUrl = "search";
const imageFolderUrl = "https://storage.cloud.google.com/shopify_project_image/"

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

class App extends React.Component {
  constructor() {
    super();
    this.state = { width: -1, search: '' };
    this.loadAllPhotos = this.loadAllPhotos.bind(this);
    this.searchTextChange = this.searchTextChange.bind(this);
    this.upload = this.upload.bind(this);
    this.searchPhoto = this.searchPhoto.bind(this);
  }

  componentDidMount() {
    this.loadAllPhotos();
  }

  loadAllPhotos() {
    const requestOptions = {
      method: 'GET'
    };
    fetch(backendUrl + getAllUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        const imagesData = data.rows;
        let photos = [];
        for (let i = 0; i < imagesData.length; i++) {
          photos[i] = {
            src: imageFolderUrl + imagesData[i].id.split(':')[1] + '.jpg',
            width: imagesData[i].doc.width,
            height: imagesData[i].doc.height
          }
        }
        console.log(photos)
        this.setState({
          photos: photos
        });
      })
  }

  searchTextChange(e) {
    this.setState({ search: e }, () => {
      console.log(this.state);
    })
  }

  searchPhoto() {
    const requestOptions = {
      method: 'GET',
    };
    const searchPhotoURL = backendUrl + searchUrl + "?searchText=" + this.state.search;
    fetch(searchPhotoURL, requestOptions)
      .then(response => response.json())
      .then(data => {
        const imagesData = data.docs;
        console.log(imagesData);
        let photos = [];
        for (let i = 0; i < imagesData.length; i++) {
          photos[i] = {
            src: imageFolderUrl + imagesData[i]._id.split(':')[1] + '.jpg',
            width: imagesData[i].width,
            height: imagesData[i].height
          }
        }
        console.log(photos)
        this.setState({
          photos: photos,
        });
      })
  }

  // Send image(base64 encode) to backend server.
  upload(picture) {
    let pic = picture[0];
    let picEncode;
    toBase64(pic).then((res) => {
      picEncode = res;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: picEncode })
      };
      fetch(backendUrl + uploadUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState({ searchText: ''}, () => {
            this.loadAllPhotos();
          })
        })
    });
  }

  render() {
    if (this.state.photos) {
      const width = this.state.width;
      return (
        <div className="App">
          <div>
            <SearchField
              placeholder="Search Photo..."
              searchText=""
              onChange={this.searchTextChange}
              classNames="test-class"
              onSearchClick={this.searchPhoto}
            />
          </div>
          <ImageSection photos={this.state.photos} />
          <ImageUploader
            withIcon={true}
            buttonText='Choose images'
            onChange={this.upload}
            imgExtension={['.jpg']}
            label='Max file size: 5mb, accepted: jpg'
            maxFileSize={5242880}
            singleImage={true}
          />
        </div>
      );
    } else {
      return (
        <div className="App">
          <div id="msg-app-loading" className="loading-msg">
            Loading
          </div>
        </div>
      );
    }
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
