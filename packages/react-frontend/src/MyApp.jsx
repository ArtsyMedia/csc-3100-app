// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter(index) {
        const character = characters[index];

        fetch(`http://localhost:8000/users/${character.id}`, {
            method: "DELETE",
        }).then((res) => {
            if (res.status === 404) {
                throw new Error("User not found");
            }
            if (res.status !== 204) {
                throw new Error(`DELETE failed with status ${res.status}`);
            }

            setCharacters((currentCharacters) =>
                currentCharacters.filter((_, i) => i !== index)
            );
        }).catch((error) => {
            console.log(error);
        });
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        return promise;
    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status !== 201) {
                    throw new Error(`POST failed with status ${res.status}`);
                }
                return res.json();
            })
            .then((newUser) =>
                setCharacters((currentCharacters) => [...currentCharacters, newUser])
            )
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;