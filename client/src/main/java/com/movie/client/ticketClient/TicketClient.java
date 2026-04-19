package com.movie.client.ticketClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * @author GitHub Copilot
 */
@FeignClient(name = "ticket", configuration = com.movie.jwt.jwt.FeignConfig.class)
public interface TicketClient {

    @GetMapping(value = "/api/v1/ticket/schedule/{scheduleId}/seat-ids")
    List<Long> getReservedSeatIds(@PathVariable("scheduleId") Long scheduleId);
}
