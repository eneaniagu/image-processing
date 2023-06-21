
import { useState } from "react";
import axios from 'axios';
import LoadingModal from "./Loading";

const Content = () => {
    const [result, setResult] = useState([]);
    const [xfile, setfile] = useState();
    const [ imgUrl, setimgUrl]  = useState()
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState('')
    const [theCaption, settheCaption] = useState('')

    const handleChange = (event) => {
        const selectedFile = event.target.files[0];
        setFiles(event.target.files[0])
    
        if (selectedFile) {
          const reader = new FileReader();
    
          reader.onload = () => {
            const imageUrl = reader.result;
            setfile(imageUrl);
            setimgUrl(imageUrl)
          };
    
          reader.readAsDataURL(selectedFile);
        }
      };


      const ClearHandler = () => {
        setfile(null)
        setResult([])
        settheCaption('')
      }


      const handleclarifai = () => {
        setResult([]);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);


        if(files){
            const formData = new FormData();
            formData.append('image', files);

            axios
        .post('https://moxieus.tech/pimus/public/uploadimagerpro', formData)
        .then((response) => {
          
        
        // console.log(); 
        //   start
         // URL of image to use. Change this to your image.
         setUploadedUrl(response.data.data)
  const IMAGE_URL = `https://moxieus.tech/pimus/public/imagepro/${response.data.data}`;
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "clarifai",
      "app_id": "main"
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + 'bcbcc38062cc4b38b5252164804d5143'
      },
      body: raw
  };
  
  fetch(`https://api.clarifai.com/v2/models/general-image-detection/versions/1580bb1932594c93b7e2e04456af7c6f/outputs`, requestOptions)
      .then(response => response.text())
      .then(response => {
    
            const data = JSON.parse(response)
            const regions = data.outputs[0].data.regions;
            const resultList = regions.map(region => {
              const concepts = region.data.concepts;
              const topConcept = concepts[0];
              return `${topConcept.name}`;
            });
            setResult(resultList);

          

      })
      .catch(error => console.log('error', error));
    
  


        //   end
        })
        .catch((error) => {
          console.log(error); // Handle any errors
        });



       

        }
        


      }


     const  handleCaption = () => {
    
const IMAGE_URL = `https://moxieus.tech/pimus/public/imagepro/${uploadedUrl}`;

const raw = JSON.stringify({
  "user_app_id": {
    "user_id": "salesforce",
    "app_id": "blip"
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + 'c9f0ce7014844fcbac49a6e9d8fbb963'
    },
    body: raw
};

fetch(`https://api.clarifai.com/v2/models/general-english-image-caption-blip/versions/cdb690f13e62470ea6723642044f95e4/outputs`, requestOptions)
    .then(response => response.json())
    .then(result => {
      
       settheCaption(result.outputs[0].data.text.raw)
    })
    .catch(error => console.log('error', error));
  
      }




    return (
        <div >
         
                  <h2 className="text-white text-2xl font-bold text-center mt-20 ">IMAGE PROCESSING</h2>
            <div className="mt-10 ml-[30em]">
          

<div className="flex space-x-10  mb-10">
<div className="border-2 rounded-md bg-white w-[8em] h-[2.5em] mb-4 ml-10">
    <label  for="file" className="p-2">UPload Media</label>
    <input type="file" id="file" onChange={handleChange} className="" hidden name="images" multiple />
</div>

<button onClick={handleclarifai} className="bg-white w-[8em] h-[2.5em] border-2 rounded-md">Identify</button>

<button onClick={handleCaption} className="bg-white w-[8em] h-[2.5em] border-2 rounded-md">Get Caption</button>

<button onClick={ClearHandler} className="bg-white w-[8em] h-[2.5em] border-2 rounded-md">Reset</button>
</div>
  <div className="flex space-x-4">
    <div>
    <div className="mt-4 font-bold text-white mb-2">
    { theCaption && <h2>The Caption: {theCaption}</h2>}
</div>
<div className="w-[50em] h-auto bg-white overflow-hidden border-2">
     
   {xfile && <img src={xfile} alt="Uploaded" />}
     
</div>
</div>
<div className="bg-white border-2  h-[30em] overflow-auto w-[15em]">
<ul>
      <div className="mt-40 ml-10 absolute"> 
      
     { loading &&  <LoadingModal/>}
      </div>
        {result.map((item, index) => (
          <li className="p-2" key={index}>{item}</li>
        ))}
      </ul>

      
</div>
</div>

            </div>

        </div>
    )
}

export default Content