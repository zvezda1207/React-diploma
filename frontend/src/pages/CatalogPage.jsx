import { useSearchParams } from "react-router-dom";
import Header from "../components/Header"
import Footer from "../components/Footer"
import Banner from "../components/Banner"
import Catalog from "../components/Catalog"

export default function CatalogPage() {
    const [searchParams] = useSearchParams();
    const initialSearchQuery = searchParams.get('q') || '';

    return (
        <>
            <Header />
            <main className="container">
                <div className="row">
                    <div className="col">
                        <Banner />
                        <Catalog enableSearch initialSearchQuery={initialSearchQuery} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}