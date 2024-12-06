import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Parish } from "../../types/Parish";
import { ParishListItem } from "./ParishListItem";
import { Typography } from "../ui/Typography";

interface ParishListProps {
    parishes: Parish[];
    onParishSelect: (parish: Parish) => void;
    loading?: boolean;
}

export function ParishList({ 
    parishes, 
    onParishSelect, 
    loading = false 
}: ParishListProps) {
    if (loading) {
        return (
            <stackLayout className="p-4">
                <activityIndicator busy={true} />
            </stackLayout>
        );
    }

    if (parishes.length === 0) {
        return (
            <stackLayout className="p-4">
                <Typography variant="caption" className="text-center">
                    No parishes found
                </Typography>
            </stackLayout>
        );
    }

    return (
        <scrollView>
            <stackLayout className="p-4">
                {parishes.map((parish) => (
                    <ParishListItem
                        key={parish.id}
                        parish={parish}
                        onTap={() => onParishSelect(parish)}
                    />
                ))}
            </stackLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({});