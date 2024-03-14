import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet /> {/*  le contenu de mes routes sera rendu entre le Header et le Footer */}
      <Footer />
    </>
  );
}
