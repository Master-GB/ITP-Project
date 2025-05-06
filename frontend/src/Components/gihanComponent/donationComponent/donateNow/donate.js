import React, { useState } from "react";
import "./donate.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Donate() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    foodCategory: "",
    foodItem: "",
    storageCondition: "",
    expiryDate: "",
    quantity: "",
    quantityUnit: "",
    collectionAddress: "",
    imageOfFoods: null, 
    notes: "",
  });
  const [quantityMsg, setQuantityMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      if (value.length > 1) {
        setQuantityMsg("Only one digit is allowed for quantity (0-9)");
        return;
      } else {
        setQuantityMsg("");
      }
    }
    setInputs({ ...inputs, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  const navigate = useNavigate();

  const foodCategoryMap = {
    Meat: ["Chicken", "Fish", "Pork","Ambul Thiyal","Mutton"],
    Rice: ["Fried Rice","white Rice","Biriyani","Milk Rice","Yellow Rice"],
    Baked:["Egg Rolls","Patties","Kimbula Banis","Paan","Sausage Buns","Fish Buns"],
    Desserts :["Watalappan","Ice cream","Fruit Salad","Cake"],
    Koththu: [],
    Noodles: [],
    Curry: ["Dhal Curry","Soya Curry","Manioc Curry","Bonchi Curry","Polos Curry","Kiri Kos Curry","Batu Moju ","Ala Curry","Kola Mallum","Kaju Curry","Kehel Muwa Curry","Mushroom Curry"],
  };

 
  const validateForm = () => {
    const newErrors = {};

    if (!inputs.foodCategory) {
      newErrors.foodCategory = "Food category is required";
    }

    if (
      foodCategoryMap[inputs.foodCategory] &&
      foodCategoryMap[inputs.foodCategory].length > 0 &&
      !inputs.foodItem
    ) {
      newErrors.foodItem = "Food item is required";
    }

    if (!inputs.storageCondition) {
      newErrors.storageCondition = "Storage condition is required";
    }

    if (!inputs.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (new Date(inputs.expiryDate) <=new Date()) {
      newErrors.expiryDate = "Expiry date must be after the current date";
    }

    const selectedDate = new Date(inputs.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxAllowedDate = new Date(today);
    maxAllowedDate.setDate(today.getDate() + 3);
    if (selectedDate > maxAllowedDate) {
      newErrors.expiryDate = "Expiry date must be within the next 3 days";
    }

    if (!inputs.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(inputs.quantity)) {
      newErrors.quantity = "Quantity must be a number";
    }else if (!/^[0-9]$/.test(inputs.quantity)) {
      newErrors.quantity = "Please enter a  kg or unit between (0-9)";
    }

    if (!inputs.quantityUnit) {
      newErrors.quantityUnit = "Quantity unit/Kg is required";
    }

    if (!inputs.collectionAddress) {
      newErrors.collectionAddress = "Collection address is required";
    }
    console.log("Validation Errors:", newErrors); 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed. Form not submitted."); 
      return; 
    }

  
    const formData = new FormData();

  
    formData.append("foodCategory", inputs.foodCategory);
    formData.append("foodItem", inputs.foodItem);
    formData.append("storageCondition", inputs.storageCondition);
    formData.append("expiryDate", inputs.expiryDate);
    formData.append("quantity", inputs.quantity);
    formData.append("quantityUnit", inputs.quantityUnit);
    formData.append("collectionAddress", inputs.collectionAddress);
    formData.append("notes", inputs.notes);

  
    if (inputs.imageOfFoods) {
      formData.append("imageOfFoods", inputs.imageOfFoods);
    }

    try {
      
      await axios.post("http://localhost:8090/donations/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      alert("Donation Added Successfully");
      navigate("/dashboard"); 
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files); 

    
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      alert("Only image files are allowed (e.g., .jpg, .png, .jpeg, .gif).");
      return;
    }


    setInputs({ ...inputs, imageOfFoods: validFiles[0] });
    setErrors({ ...errors, imageOfFoods: "" }); 
  };

  return (
      <main className="main-content" id="back" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url('/Resources/gihanRes/donationRes/donatebg2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh", 
        width: "100%"
      }}

        >
        <div className="donate-container">
          <h1>Donate Food</h1>
          <p>Fill in the details below to make your food donation</p>
          <form onSubmit={handleSubmit}>
            <div className="food-details-group">
              <div className="food-category-group">
                <label htmlFor="foodCategory">Food Category:</label>
                <select
                  name="foodCategory"
                  id="foodCategory"
                  value={inputs.foodCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(foodCategoryMap).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.foodCategory && (
                  <span className="error">{errors.foodCategory}</span>
                )}
              </div>
              {foodCategoryMap[inputs.foodCategory] &&
                foodCategoryMap[inputs.foodCategory].length > 0 && (
                  <div className="food-item-group">
                    <label htmlFor="foodItem">Food Item:</label>
                    <select
                      name="foodItem"
                      id="foodItem"
                      value={inputs.foodItem}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Item</option>
                      {foodCategoryMap[inputs.foodCategory].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {errors.foodItem && (
                      <span className="error">{errors.foodItem}</span>
                    )}
                  </div>
                )}
            </div>

            <div className="storage-date-section">
              <div className="storage-condition-group">
                <label htmlFor="storageCondition" className="storage-date-label">
                  Storage Condition:
                </label>
                <div className="storage-condition-options">
                  <label className="storage-lable">
                    <input
                      type="radio"
                      name="storageCondition"
                      value="refrigerated"
                      checked={inputs.storageCondition === "refrigerated"}
                      onChange={handleChange}
                    />{" "}
                    Refrigerated
                  </label>
                  <label className="storage-lable">
                    <input
                      type="radio"
                      name="storageCondition"
                      value="room-temperature"
                      checked={inputs.storageCondition === "room-temperature"}
                      onChange={handleChange}
                    />{" "}
                    Room Temperature
                  </label>
                </div>
                {errors.storageCondition && (
                  <span className="error">{errors.storageCondition}</span>
                )}
              </div>
              <div className="date-fields">
                <div className="expiration-date-group">
                  <label htmlFor="expiryDate">Expiration Date:</label>
                  <input
                    type="date"
                    name="expiryDate"
                    id="expiryDate"
                    value={inputs.expiryDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.expiryDate && (
                    <span className="error">{errors.expiryDate}</span>
                  )}
                </div>
                <div className="collection-address-section">
                  <label htmlFor="collectionAddress">Collection Address:</label>
                  <input
                    type="text"
                    name="collectionAddress"
                    id="collectionAddress"
                    value={inputs.collectionAddress}
                    onChange={handleChange}
                    placeholder="Enter collection address"
                    required
                  />
                  {errors.collectionAddress && (
                    <span className="error">{errors.collectionAddress}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="quantity-address-section">
              <div className="quantity-section">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-input-group">
                  <input
                    type="text"
                    placeholder="Enter quantity"
                    className="quantity-input"
                    id="quantity"
                    name="quantity"
                    value={inputs.quantity}
                    onChange={handleChange}
                    maxLength={1}
                    required
                  />
                  {quantityMsg && (
                    <span className="error">{quantityMsg}</span>
                  )}
                  <div className="quantity-radio-group">
                    <label className="quan-lable">
                      <input
                        type="radio"
                        name="quantityUnit"
                        value="kg"
                        checked={inputs.quantityUnit === "kg"}
                        onChange={handleChange}
                      />{" "}
                      kg
                    </label>
                    <label className="quan-lable" id = "unit-qua">
                      <input
                        type="radio"
                        name="quantityUnit"
                        value="unit"
                        checked={inputs.quantityUnit === "unit"}
                        onChange={handleChange}
                      />{" "}
                      unit
                    </label>
                  </div>
                </div>
                {errors.quantity && (
                  <span className="error">{errors.quantity}</span>
                )}
                {errors.quantityUnit && (
                  <span className="error">{errors.quantityUnit}</span>
                )}
              </div>
            </div>

            <div className="food-images-section">
              <label>Food Images:</label>
              <div
                className={`file-input-container ${
                  isDragOver ? "drag-over" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const files = Array.from(e.dataTransfer.files);
                  handleImageUpload({ target: { files } });
                }}
              >
                {inputs.imageOfFoods ? (
                  <div className="uploaded-image-preview">
                    <img
                      src={URL.createObjectURL(inputs.imageOfFoods)}
                      alt="Uploaded"
                    />
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="drag-drop-text">
                      Drag and Drop an image here or
                    </div>
                    <div className="browse-files-text">
                      <label htmlFor="file-upload">Browse image</label>
                    </div>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  onClick={(e) => (e.target.value = null)}
                />
              </div>
              {errors.imageOfFoods && (
                <span className="error">{errors.imageOfFoods}</span>
              )}
            </div>

            <div className="additional-notes-section">
              <label htmlFor="notes">Additional Notes:</label>
              <textarea
                name="notes"
                id="notes"
                value={inputs.notes}
                onChange={handleChange}
                placeholder="Enter any additional notes here..."
              />
            </div>

            <div className="checkbox-section">
              <label htmlFor="agreement">
                <input
                  type="checkbox"
                  id="agreement"
                  required 
                />
                I agree to the donation guidelines and conditions.
              </label>
            </div>

            <button type="submit" className="submit-b">
              Submit Donation
            </button>
          </form>
        </div>
      </main>
  );
}