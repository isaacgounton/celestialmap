import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { Product } from "../../types/Product";
import { ProductCard } from "../ui/ProductCard";
import { getProducts } from "../../services/marketplaceService";

type MarketplaceScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Marketplace">;
};

export function MarketplaceScreen({ navigation }: MarketplaceScreenProps) {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getProducts().then(products => {
            setProducts(products);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <flexboxLayout style={styles.container}>
                <activityIndicator busy={true} />
            </flexboxLayout>
        );
    }

    return (
        <scrollView>
            <flexboxLayout style={styles.container}>
                <gridLayout rows="auto" columns="*,*" className="w-full mb-4">
                    <label row="0" col="0" className="text-xl font-bold">
                        Parish Marketplace
                    </label>
                    <button 
                        row="0" 
                        col="1" 
                        className="text-blue-500 text-right"
                        text="Filter"
                    />
                </gridLayout>

                <gridLayout className="w-full" columns="*,*">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            row={Math.floor(index / 2)}
                            col={index % 2}
                            onTap={() => {}}
                        />
                    ))}
                </gridLayout>
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "column"
    }
});