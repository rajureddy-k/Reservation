package com.movie.common;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.movie.common.TotalSeatsDTO;

import java.io.IOException;

/**
 * @author DMITRII LEVKIN on 30/12/2024
 * @project Movie-Reservation-System
 */
public class TotalSeatsDTODeserializer extends JsonDeserializer<TotalSeatsDTO> {
    @Override
    public TotalSeatsDTO deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        ObjectNode node = p.readValueAsTree();
        if (node.has("totalSeats")) {
            return new TotalSeatsDTO(node.get("totalSeats").asInt());
        }
        // Fallback for direct integer values
        return new TotalSeatsDTO(node.asInt());
    }
}