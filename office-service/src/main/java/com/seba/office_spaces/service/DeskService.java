package com.seba.office_spaces.service;

import com.seba.office_spaces.dto.DeskDTO;
import com.seba.office_spaces.exception.errors.ResourceNotFoundException;
import com.seba.office_spaces.model.Desk;
import com.seba.office_spaces.repository.DeskRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class DeskService {
    
    private final DeskRepository deskRepository;
    private final RoomService roomService;


    public Desk getDeskById(Long id) {
        return deskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desk not found"));
    }

    public Desk createDesk(DeskDTO deskDTO) {

        var room = roomService.getRoomById(deskDTO.getRoomId());

        Desk desk = new Desk();
        desk.setRoom(room);
        //todo: equipment

        return deskRepository.save(desk);
    }

    public Desk updateDesk(Long id, DeskDTO deskDTO) {

        var room = roomService.getRoomById(deskDTO.getRoomId());

        Desk desk = getDeskById(id);
        desk.setRoom(room);
        //todo: equipment

        return deskRepository.save(desk);
    }

    public void deleteDesk(Long id) {
        Desk desk = getDeskById(id);
        deskRepository.delete(desk);
    }
}
