import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Parish } from "../../types/Parish";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

interface ParishListItemProps {
    parish: Parish;
    onTap: () => void;
}

export function ParishListItem({ parish, onTap }: ParishListItemProps) {
    return (
        <Card onTap={onTap} className="mb-2">
            <gridLayout rows="auto, auto" columns="auto, *">
                <image
                    row={0}
                    col={0}
                    rowSpan={2}
                    src={parish.photos[0]}
                    className="w-16 h-16 rounded-lg mr-4"
                />
                <Typography
                    row={0}
                    col={1}
                    variant="h3"
                    className="mb-1"
                >
                    {parish.name}
                </Typography>
                <Typography
                    row={1}
                    col={1}
                    variant="caption"
                >
                    {parish.address}
                </Typography>
            </gridLayout>
        </Card>
    );
}

const styles = StyleSheet.create({});