import axios from "axios";
import qs from "qs";
import { Buffer } from 'buffer';

const baseURL = "https://api.spotify.com/v1/";

const client = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

const getAccessToken = async () => {
  const clientId = "e0610e0e032e4fbda1e9a21638218a6b";
  const clientSecret = "6c05a3a1d34f4e84967720f98c7d3a40";
  const authString = `${clientId}:${clientSecret}`;
  const base64AuthString = Buffer.from(authString).toString("base64");

  const data = {
    grant_type: "client_credentials",
  };

  const config = {
    headers: {
      Authorization: `Basic ${base64AuthString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify(data),
    config
  );

  return response.data.access_token;
};

const getGeneros = async () => {
  const token = await getAccessToken();
  const uri = encodeURI(`recommendations/available-genre-seeds`);
  return await client.get(uri, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const buscarArtistasPorGenero = async (genero) => {
  const token = await getAccessToken();
  const uri = `search?type=artist&q=genre:${genero}`;
  const response = await client.get(uri, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const buscarArtistasPorNome = async (nomeArtista) => {
  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(nomeArtista)}&type=artist`;
  const accessToken = await getAccessToken();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  return data;
};

const buscarArtistasPorId = async (idArtista) => {
  const endpoint = `https://api.spotify.com/v1/artists/${idArtista}`
  const accessToken = await getAccessToken();

  const response = await fetch(endpoint, {
    headers:{
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

export { getGeneros, buscarArtistasPorGenero, buscarArtistasPorNome, buscarArtistasPorId };
