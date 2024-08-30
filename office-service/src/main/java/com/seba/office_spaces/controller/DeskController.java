package com.seba.office_spaces.controller;

import com.seba.office_spaces.dto.DeskDTO;
import com.seba.office_spaces.model.Desk;
import com.seba.office_spaces.service.DeskService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/desk")
public class DeskController {

    private final String TAG = "DeskController - ";

    private final DeskService deskService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Desk getDesk(@PathVariable("id") Long id) {
        log.info(TAG + "Get Desk with id {}", id);
        return deskService.getDeskById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Desk createDesk(@RequestBody DeskDTO deskDTO) {
        log.info(TAG + "Create new desk {}", deskDTO);
        return deskService.createDesk(deskDTO);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Desk updateDesk(@PathVariable("id") Long id,
                           @RequestBody DeskDTO deskDetails) {
        log.info(TAG + "Update Desk with id {}", id);
        return deskService.updateDesk(id, deskDetails);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDesk(@PathVariable("id") Long id) {
        log.info(TAG + "Delete Desk with id {}", id);
        deskService.deleteDesk(id);
    }
}
