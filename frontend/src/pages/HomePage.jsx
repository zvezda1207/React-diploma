import Header from "../components/Header"
import Footer from "../components/Footer"
import Banner from "../components/Banner"
import TopSales from "../components/TopSales" 
import Catalog from "../components/Catalog"  

export default function HomePage() {
    return (
        <>
            <Header />
            <main className="container">
                <div className="row">
                    <div className="col">
                        <Banner />
                        <TopSales />                        
                        <Catalog />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

