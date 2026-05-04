import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/account.css";

export default function ManageAccount() {
  const { user } = useAuth();
  const storageKey = `addresses_${user?.email || "guest"}`;

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    company: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    isDefault: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleAddAddress(e) {
    e.preventDefault();

    const updated = [...addresses, { id: Date.now(), ...form }];
    setAddresses(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setForm({
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      company: "",
      phone: "",
      address: "",
      city: "",
      postcode: "",
      country: "",
      isDefault: false,
    });
  }

  function deleteAddress(id) {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  return (
    <main className="account-layout">
      <aside className="account-sidebar">
        <a>Purchases</a>
        <a>Wishlist</a>
        <a className="active">Addresses ({addresses.length})</a>
        <a>Manage account</a>
      </aside>

      <section className="address-panel">
        <h1>Add address</h1>

        <form onSubmit={handleAddAddress} className="jb-address-form">
          <div className="form-row two">
            <label>
              <span>First Name</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Last Name</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company (optional)"
            />
          </label>

          <label>
            <span>Mobile phone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Address</span>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address"
              required
            />
          </label>

          <div className="form-row two">
            <label>
              <span>City</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Postcode</span>
              <input
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            <span>Country</span>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              required
            />
          </label>

          <label className="default-check">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            Set as default address
          </label>

          <div className="form-actions">
            <button type="button" className="cancel-btn">
              Cancel
            </button>

            <button type="submit" className="save-address-btn">
              Add Address
            </button>
          </div>
        </form>

        <div className="saved-address-section">
          <h2>Saved addresses</h2>

          {addresses.length === 0 ? (
            <p className="no-address">No address added yet.</p>
          ) : (
            <div className="saved-address-list">
              {addresses.map((item) => (
                <div className="saved-address-card" key={item.id}>
                  <h3>
                    {item.firstName} {item.lastName}
                  </h3>
                  <p>{item.phone}</p>
                  {item.company && <p>{item.company}</p>}
                  <p>{item.address}</p>
                  <p>
                    {item.city}, {item.postcode}
                  </p>
                  <p>{item.country}</p>
                  {item.isDefault && <span>Default</span>}

                  <button onClick={() => deleteAddress(item.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}