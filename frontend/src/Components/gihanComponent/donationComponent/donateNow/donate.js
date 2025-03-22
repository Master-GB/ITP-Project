import React, { useState } from "react";
import "./donate.css";
import Nav from "../navBar/nav";
import Footer from "../footer/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Donate() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState({}); // State to store validation errors

  const [inputs, setInputs] = useState({
    foodCategory: "",
    foodItem: "",
    storageCondition: "",
    donationDate: "",
    expiryDate: "",
    quantity: "",
    quantityUnit: "",
    collectionAddress: "",
    imageOfFoods: null, // Store the image file
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    // Clear errors when the user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const navigate = useNavigate();

  const foodCategoryMap = {
    Meat: ["Chicken", "Fish", "Pork"],
    Rice: [],
    Koththu: [],
    Noodless: [],
    Curry: ["Parippu", "kola mellum", "Bathala"],
  };

  // Frontend validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate food category
    if (!inputs.foodCategory) {
      newErrors.foodCategory = "Food category is required";
    }

    // Validate food item (if category has items)
    if (
      foodCategoryMap[inputs.foodCategory] &&
      foodCategoryMap[inputs.foodCategory].length > 0 &&
      !inputs.foodItem
    ) {
      newErrors.foodItem = "Food item is required";
    }

    // Validate storage condition
    if (!inputs.storageCondition) {
      newErrors.storageCondition = "Storage condition is required";
    }

    // Validate donation date
    if (!inputs.donationDate) {
      newErrors.donationDate = "Donation date is required";
    }else if(new Date()> new Date(inputs.donationDate)){
        newErrors.donationDate = "Donation date must be after the current date.";
    }

    // Validate expiry date
    if (!inputs.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (new Date(inputs.expiryDate) <= new Date(inputs.donationDate)) {
      newErrors.expiryDate = "Expiry date must be after the donation date";
    }

    // Validate quantity
    if (!inputs.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(inputs.quantity)) {
      newErrors.quantity = "Quantity must be a number";
    }

    // Validate quantity unit
    if (!inputs.quantityUnit) {
      newErrors.quantityUnit = "Quantity unit is required";
    }

    // Validate collection address
    if (!inputs.collectionAddress) {
      newErrors.collectionAddress = "Collection address is required";
    }
    console.log("Validation Errors:", newErrors); // Log the errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      console.log("Validation failed. Form not submitted."); // Log validation failure
      return; // Stop if validation fails
    }

    // Create a FormData object
    const formData = new FormData();

    // Append all form fields to the FormData object
    formData.append("foodCategory", inputs.foodCategory);
    formData.append("foodItem", inputs.foodItem);
    formData.append("storageCondition", inputs.storageCondition);
    formData.append("donationDate", inputs.donationDate);
    formData.append("expiryDate", inputs.expiryDate);
    formData.append("quantity", inputs.quantity);
    formData.append("quantityUnit", inputs.quantityUnit);
    formData.append("collectionAddress", inputs.collectionAddress);
    formData.append("notes", inputs.notes);

    // Append the image file if it exists
    if (inputs.imageOfFoods) {
      formData.append("imageOfFoods", inputs.imageOfFoods);
    }

    try {
      // Send the FormData object to the backend
      await axios.post("http://localhost:8090/donations/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for file upload
        },
      });

      alert("Donation Added Successfully");
      navigate("/dashboard"); // Redirect to the home page or another route
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files); // Handle both browse and drag-and-drop

    // Validate file types (only images allowed)
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      alert("Only image files are allowed (e.g., .jpg, .png, .jpeg, .gif).");
      return;
    }

    // Replace the existing image with the new one
    setInputs({ ...inputs, imageOfFoods: validFiles[0] });
    setErrors({ ...errors, imageOfFoods: "" }); // Clear image error
  };

  return (
    <div className="main-content-wrapper">
      <Nav />
      <main className="main-content">
        <div className="donate-container">
          <h1>Donate Food</h1>
          <p>Fill in the details below to make your food donation</p>
          <form onSubmit={handleSubmit}>
            {/* Food Category and Item Section */}
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

            {/* Storage & Date Section */}
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
                <div className="donation-date-group">
                  <label htmlFor="donationDate">Donation Date:</label>
                  <input
                    type="date"
                    name="donationDate"
                    id="donationDate"
                    value={inputs.donationDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.donationDate && (
                    <span className="error">{errors.donationDate}</span>
                  )}
                </div>
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
              </div>
            </div>

            {/* Quantity and Collection Address Section */}
            <div className="quantity-address-section">
              {/* Quantity Section */}
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
                    required
                  />
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
                    <label className="quan-lable">
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

              {/* Collection Address Section */}
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

            {/* Food Images Section */}
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

            {/* Additional Notes Section */}
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

            {/* Checkbox for Agreement */}
            <div className="checkbox-section">
              <label htmlFor="agreement">
                <input
                  type="checkbox"
                  id="agreement"
                  required // Make the checkbox mandatory
                />
                I agree to the donation guidelines and conditions.
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-b">
              Submit Donation
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}